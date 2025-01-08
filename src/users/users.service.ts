import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  create(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  findById(userId: string): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['friends'],
      where: { userId },
    });
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
    // Initialize result object with all months
    const result = {
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: []
    };

    // Map month number to month name
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    data.forEach(person => {
      const birthday = new Date(person.birthday);
      const monthName = monthNames[birthday.getMonth()];
      
      // Calculate age
      const today = new Date();
      let age = today.getFullYear() - birthday.getFullYear();
      const monthDiff = today.getMonth() - birthday.getMonth();
      
      // Adjust age if birthday hasn't occurred this year yet
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }
      
      // Add age to person object
      result[monthName].push({ ...person, age });
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
}
