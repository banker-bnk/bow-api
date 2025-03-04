import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './entities/user';
import { age, mmdd, mmddStr } from 'src/helpers/date-format.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll({ page, limit }: { page: number; limit: number }) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      total,
      page,
      limit,
      data: users,
    };
  }

  create(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['friends', 'gifts'],
      where: { id: parseInt(userId) },
    });
    
    if (user) {
      user['age'] = age(new Date(user.birthday));
    }

    return user;
  }

  async findBySub(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['friends', 'gifts'],
      where: { userId },
    });

    return user;
  }

  async getFriendsBirthdays(userId: string): Promise<any> {
    const data = this.usersRepository.query(
      `
      WITH target_user AS (
          SELECT id FROM public.users WHERE "userId" = $1
      )
      SELECT 
          u.id AS friend_id,
          u."userName",
          u."firstName",
          u."lastName",
          u.image,
          u.birthday
      FROM 
          public.friends f
      JOIN 
          public.users u
          ON (f."userId" = u.id AND f."friendId" = (SELECT id FROM target_user))
          OR (f."friendId" = u.id AND f."userId" = (SELECT id FROM target_user))
      ORDER BY 
          EXTRACT(MONTH FROM u.birthday),
          EXTRACT(DAY FROM u.birthday);
    `,
      [userId],
    );

    return data;
  }

  async friendsBirthdayByMonth(userId: string) {
    const data = await this.getFriendsBirthdays(userId);
    const result = {};

    // Map month number to month name
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    data.forEach(person => {
      
      const birthday = new Date(person.birthday);
      const monthName = monthNames[birthday.getMonth()];
      
      const birthdayFormatted = mmdd(birthday);
      
      // Initialize array for month if it doesn't exist
      if (!result[monthName]) {
        result[monthName] = [];
      }
      
      const personAge = age(birthday);
      
      result[monthName].push({ ...person, age: personAge, birthdayFormatted });
    });

    return result;
  }

  async friendsBirthdayUpcoming(userId: string, givenDate: string) {
    const data = await this.getFriendsBirthdays(userId);
    const now = new Date(givenDate);
    const currentMonthDay = new Date(0, now.getMonth(), now.getDate()); // Ignore year in the given date

    const in30 = [];
    const in60 = [];
    const soon = [];

    data.forEach((person) => {
      const birthday = new Date(person.birthday); // Convert birthday to a Date object
      const birthdayMonthDay = new Date(
        0,
        birthday.getMonth(),
        birthday.getDate(),
      ); // Ignore year in the birthday
      // Calculate the difference in days
      let diffInDays = Math.ceil(
        (birthdayMonthDay.getTime() - currentMonthDay.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      // Adjust for dates in the next calendar year
      if (diffInDays < 0) {
        diffInDays += 365; // Account for wrap-around in the calendar
      }

      // Categorize based on the difference in days
      if (diffInDays <= 30) {
        in30.push(person);
      } else if (diffInDays <= 60) {
        in60.push(person);
      } else {
        soon.push(person);
      }
    });

    return {
      in30,
      in60,
      soon,
    };
  }

  async searchUsers(searchTerm: string, { page, limit }: { page: number; limit: number }) {
    const [users, total] = await this.usersRepository.findAndCount({
      where: [
        { userName: ILike(`%${searchTerm}%`) },
        { firstName: ILike(`%${searchTerm}%`) },
        { lastName: ILike(`%${searchTerm}%`) },
        { email: ILike(`%${searchTerm}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return {
      total,
      page,
      limit,
      data: users,
    };
  }
}
