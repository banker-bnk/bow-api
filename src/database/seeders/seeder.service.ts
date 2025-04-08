import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user';
import { Friend } from '../../friends/entities/friend';
import { FriendInvitation } from '../../friend-invitations/entities/friend-invitation';
import { Gift } from '../../gifts/entities/gift';
import { GiftsPayment } from '../../gifts-payments/entities/gifts-payment';
import { Like } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendInvitation)
    private readonly friendInvitationRepository: Repository<FriendInvitation>,
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
    @InjectRepository(GiftsPayment)
    private readonly giftPaymentRepository: Repository<GiftsPayment>,
  ) {}

  private seededUsers: User[] = [];
  private readonly SEEDER_TAG = 'SEEDER_DATA';

  private readonly AVATAR_URLS = [
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e',
    'https://images.unsplash.com/photo-1546456073-ea246a7bd25f',
    'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  ];

  private readonly GIFT_TEMPLATES = [
    {
      title: 'Zapatillas adidas Hockey Youngstar Niños Beige Ig2040 Talle 3 Uk',
      description: 'Zapatillas adidas Hockey Youngstar Niños Beige',
      link: 'https://www.mercadolibre.com.ar/zapatillas-adidas-hockey-youngstar-ninos-beige-ig2040-talle-3-uk/p/MLA46968298?pdp_filters=condition%3Anew%7Cadult_content%3Ayes%7Cpromotion_type%3Adeal_of_the_day%7Cofficial_store%3A964%23polycard_client=mshops-appearance-api%26source=eshops%26component=offers_carousel%26tracking_id=ce2db313-2cc7-4039-998b-fe9b3710e87b%26wid=MLA1481479113%26sid=storefronts',
      image: 'http://http2.mlstatic.com/D_759263-MLA82948874167_032025-O.jpg',
      priceRange: { min: 800000, max: 1200000 }
    },
    {
      title: 'Nintendo Switch OLED',
      description: 'Nintendo Switch gaming console with OLED display',
      link: 'https://articulo.mercadolibre.com.ar/MLA-1422582999-consola-nintendo-switch-oled-neon-version-japonesa-_JM',
      image: 'http://http2.mlstatic.com/D_803086-MLA47920649105_102021-O.jpg',
      priceRange: { min: 700000, max: 900000 }
    },
    {
      title: 'Google Reloj Pixel Reloj Inteligente Seguimiento Fitbit Ews',
      description: 'Google Reloj Pixel',
      link: 'https://articulo.mercadolibre.com.ar/MLA-1975495208-google-reloj-pixel-reloj-inteligente-seguimiento-fitbit-ews-_JM#polycard_client=search-nordic&position=35&search_layout=stack&type=item&tracking_id=efb05d3b-617d-4836-bac1-44e5e2839409',
      image: 'http://http2.mlstatic.com/D_776119-MLA81359545853_122024-O.jpg',
      priceRange: { min: 1200000, max: 1500000 }
    },
    {
      title: 'Telefono Celular Samsung S24 Ultra',
      description: 'Telefono Celular Samsung S24 Ultra 12gb Memoria 256gb Gris',
      link: 'https://articulo.mercadolibre.com.ar/MLA-1995779480-telefono-celular-samsung-s24-ultra-12gb-memoria-256gb-gris-_JM',
      image: 'http://http2.mlstatic.com/D_870516-MLA81671030200_012025-O.jpg',
      priceRange: { min: 2000000, max: 2500000 }
    },
    {
      title: 'Auriculares Inalámbricos Xiaomi Redmi Buds 6',
      description: 'Auriculares Inalámbricos Xiaomi Redmi Buds 6 Play Bluetooth 5.4 Color Negro',
      link: 'https://www.mercadolibre.com.ar/auriculares-inalambricos-xiaomi-redmi-buds-6-play-bluetooth-54-color-negro/p/MLA39962085?pdp_filters=deal:MLA779357-5#wid=MLA1908350486&sid=search&searchVariation=MLA39962085&position=1&search_layout=stack&type=product&tracking_id=39768602-56f5-46ba-afcf-02762d63aa86&deal_print_id=f7f22c00-00fb-11f0-87f7-e1ac678b6ac4&c_id=carouseldynamic-home&c_element_order=undefined&c_campaign=OFERTAS-IMPERDIBLES-EN-AUDIO&c_uid=f7f22c00-00fb-11f0-87f7-e1ac678b6ac4',
      image: 'http://http2.mlstatic.com/D_833941-MLU78764933573_082024-O.jpg',
      priceRange: { min: 500000, max: 700000 }
    },
    {
      title: 'Smartwatch Xiaomi Redmi 5 Active 2 Negro',
      description: 'Smartwatch Xiaomi Redmi 5 Active 2 Negro',
      link: 'https://www.mercadolibre.com.ar/xiaomi-redmi-watch-5-active-con-hyperos-bateria-18-dias-llamadas-ipx8-negro/p/MLA41019871#polycard_client=search_best-seller-categories&wid=MLA1944698906&sid=search',
      image: 'http://http2.mlstatic.com/D_757122-MLA82767162270_032025-O.jpg',
      priceRange: { min: 500000, max: 700000 }
    },
    {
      title: 'Apple iPhone 16 Pro Max (256 Gb) - Titanio Del Desierto',
      description: 'Apple iPhone 16 Pro Max (256 Gb) - Titanio Del Desierto',
      link: 'https://www.mercadolibre.com.ar/apple-iphone-16-pro-max-256-gb-titanio-del-desierto/p/MLA40287856#polycard_client=search-nordic&searchVariation=MLA40287856&wid=MLA2018248004&position=3&search_layout=stack&type=product&tracking_id=572e2ab0-ff20-4983-a6c7-1512ea297ce1&sid=search',
      image: 'http://http2.mlstatic.com/D_728476-MLU78878973712_092024-O.jpg',
      priceRange: { min: 500000, max: 700000 }
    },
    {
      title: 'Kit 2 Microfonos Inalambricos Boya By-v20 2.4ghz Usb Tipo C Color Negro',
      description: 'Kit 2 Microfonos Inalambricos Boya By-v20 2.4ghz Usb Tipo C Color Negro',
      link: 'https://www.mercadolibre.com.ar/kit-2-microfonos-inalambricos-boya-by-v20-24ghz-usb-tipo-c-color-negro/p/MLA22622348?pdp_filters=deal:MLA779357-5#wid=MLA1401203523&sid=search&searchVariation=MLA22622348&position=5&search_layout=stack&type=product&tracking_id=6155486e-8ac2-4cfa-8579-38b653befc92&deal_print_id=1a307fb0-00fc-11f0-9ec3-67278c6753ea&c_id=carouseldynamic-home&c_element_order=undefined&c_campaign=OFERTAS-IMPERDIBLES-EN-AUDIO&c_uid=1a307fb0-00fc-11f0-9ec3-67278c6753ea',
      image: 'http://http2.mlstatic.com/D_600464-MLB53497379572_012023-O.jpg',
      priceRange: { min: 500000, max: 700000 }
    },
    {
      title: 'Parlante Jbl Charge 5 Jblcharge5 Portátil Con Bluetooth Waterproof Red 220v',
      description: 'Parlante Jbl Charge 5 Jblcharge5 Portátil Con Bluetooth Waterproof Red 220v',
      link: 'https://www.mercadolibre.com.ar/parlante-jbl-charge-5-jblcharge5-portatil-con-bluetooth-waterproof-red-220v/p/MLA44709712#polycard_client=search-nordic&searchVariation=MLA44709712&wid=MLA1989047576&position=12&search_layout=stack&type=product&tracking_id=0ed32753-05c7-433e-975e-6968bc24df9a&sid=search',
      image: 'http://http2.mlstatic.com/D_926489-MLU75209983150_032024-O.jpg',
      priceRange: { min: 500000, max: 700000 }
    }
  ];

  private readonly SEED_DATA = {
    users: [
      {
        userId: `auth0|67d453080b34a8222135e49f`,
        userName: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        address: '123 Main St, Anytown, USA',
        email: 'john.doe@email.com',
        birthday: new Date('1990-01-01'),
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        userId: `auth0|67d45341ddcce2694b8cdcc4`,
        userName: 'jane.smith',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
        address: '456 Oak Ave, Anytown, USA',
        email: 'jane.smith@email.com',
        birthday: new Date('1995-02-15'),
        image: 'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        userId: `auth0|67d458cfb1312bbe7a73588a`,
        userName: 'juan.perez',
        firstName: 'Juan',
        lastName: 'Perez',
        phone: '+1234567890',
        address: '123 1st St, Anytown, USA',
        email: 'juan.perez@email.com',
        birthday: new Date('1987-07-01'),
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ],
    friendships: [
      { user: 0, friend: 1 }, // John and Jane are friends (bidirectional)
    ],
    friendInvitations: [
      { sender: 0, receiver: 2 }, // John to Juan
      { sender: 2, receiver: 1 }, // Juan to Jane
    ],
    gifts: [
      {
        title: "John's Birthday Gift",
        description: "A special birthday gift for John",
        link: 'https://www.mercadolibre.com.ar/sony-playstation-5-slim-1tb-standard-bundle-ratchet-clank/p/MLA39459985',
        image: 'http://http2.mlstatic.com/D_934748-MLU78652353677_082024-O.jpg',
        price: 1699999,
        currency: 'ARS',
        user: 0,
        contributor: 1,
        amount: 350000,
      },
      {
        title: "Jane's Wedding Gift",
        description: "A special wedding gift for Jane",
        link: 'https://articulo.mercadolibre.com.ar/MLA-1472549183-campera-columbia-delta-ridge-long-down-hoodie-mujer-pluma-_JM',
        image: 'http://http2.mlstatic.com/D_807525-MLA82037975145_012025-O.jpg',
        price: 647138,
        currency: 'ARS',
        user: 1,
        contributor: 0,
        amount: 50250,
      },
      {
        title: "Juan's House Warming Gift",
        description: "A special house warming gift for Juan",
        link: 'https://articulo.mercadolibre.com.ar/MLA-1410211522-set-de-asado-p-2-personas-rectangular-hermoso-regalo-_JM',
        image: 'http://http2.mlstatic.com/D_767444-MLA69223266236_052023-O.jpg',
        price: 39999,
        currency: 'ARS',
        user: 2,
        contributor: null,
        amount: 0,
      },
    ],
  };

  private generateRandomUser(index: number): Partial<User> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      userId: `random|${faker.string.alphanumeric(24)}`,
      userName: faker.internet.username({ firstName, lastName }).toLowerCase(),
      firstName,
      lastName,
      phone: faker.phone.number(),
      address: faker.location.streetAddress(true),
      email: faker.internet.email({ firstName, lastName }),
      birthday: faker.date.between({ from: '1980-01-01', to: '2000-12-31' }),
      image: this.AVATAR_URLS[index % this.AVATAR_URLS.length],
    };
  }

  private generateRandomGift(): Partial<Gift> {
    const template = faker.helpers.arrayElement(this.GIFT_TEMPLATES);
    const price = faker.number.int({
      min: template.priceRange.min,
      max: template.priceRange.max,
    });

    return {
      title: template.title,
      description: template.description,
      price,
      currency: 'ARS',
      link: template.link,
      image: template.image,
      active: true,
      progress: 0,
      successful: false
    };
  }

  private async generateRandomRelationships(randomUsers: User[], coreUsers: User[]) {
    const relationships: Friend[] = [];
    const invitations: FriendInvitation[] = [];

    for (const randomUser of randomUsers) {
      for (const coreUser of coreUsers) {
        // 40% chance to be friends
        if (faker.number.int(100) < 40) {
          const friendship1 = this.friendRepository.create({
            user: randomUser,
            friend: coreUser
          });
          const friendship2 = this.friendRepository.create({
            user: coreUser,
            friend: randomUser
          });
          relationships.push(friendship1, friendship2);
          
          // 30% chance to contribute to core user's gift if they're friends
          if (faker.number.int(100) < 30) {
            const gift = await this.giftRepository.findOne({
              where: { user: { id: coreUser.id } },
              order: { id: 'DESC' }
            });
            
            if (gift) {
              const payment = this.giftPaymentRepository.create({
                gift,
                user: randomUser,
                amount: faker.number.int({ min: 10000, max: 50000 }),
                currency: 'ARS',
                source: this.SEEDER_TAG
              });
              await this.giftPaymentRepository.save(payment);
            }
          }
        }
        // 30% chance to have a pending invitation if not friends
        else if (faker.number.int(100) < 30) {
          // Randomly decide direction of invitation
          const [sender, receiver] = faker.number.int(1) === 0 
            ? [randomUser, coreUser]
            : [coreUser, randomUser];
            
          const invitation = this.friendInvitationRepository.create({
            sender,
            receiver,
            status: 'PENDING'
          });
          invitations.push(invitation);
        }
      }
    }

    // Save all relationships and invitations
    if (relationships.length > 0) {
      await this.friendRepository.save(relationships);
    }
    if (invitations.length > 0) {
      await this.friendInvitationRepository.save(invitations);
    }
  }

  private async resetSequences() {
    const sequences = [
      { table: 'users', seq: 'users_id_seq' },
      { table: 'friends', seq: 'friends_id_seq' },
      { table: 'friend_invitations', seq: 'friend_invitations_id_seq' },
      { table: 'gifts', seq: 'gifts_id_seq' },
      { table: 'gifts_payments', seq: 'gifts_payments_id_seq' },
    ];

    for (const { table, seq } of sequences) {
      await this.userRepository.query(
        `SELECT setval('${seq}', COALESCE((SELECT MAX(id) FROM ${table}), 1), true)`
      );
    }
  }

  private async cleanupSeededData() {
    const seededUserPattern = { pattern: `%${this.SEEDER_TAG}%` };
    
    // First delete gift payments
    await this.giftPaymentRepository.delete({ source: this.SEEDER_TAG });

    // Then delete gifts
    await this.giftRepository.createQueryBuilder()
      .delete()
      .where(`"userId" IN (SELECT id FROM users WHERE "userName" LIKE :pattern)`, seededUserPattern)
      .execute();

    // Then delete friend relationships
    await this.friendRepository.createQueryBuilder()
      .delete()
      .where(`"userId" IN (SELECT id FROM users WHERE "userName" LIKE :pattern)`, seededUserPattern)
      .orWhere(`"friendId" IN (SELECT id FROM users WHERE "userName" LIKE :pattern)`, seededUserPattern)
      .execute();

    // Then delete friend invitations
    await this.friendInvitationRepository.createQueryBuilder()
      .delete()
      .where(`"senderId" IN (SELECT id FROM users WHERE "userName" LIKE :pattern)`, seededUserPattern)
      .orWhere(`"receiverId" IN (SELECT id FROM users WHERE "userName" LIKE :pattern)`, seededUserPattern)
      .execute();

    // Finally delete users
    await this.userRepository.delete({ userName: Like(`%${this.SEEDER_TAG}%`) });
  }

  async cleanup() {
    console.log('Cleaning up seeded data...');
    await this.cleanupSeededData();
    console.log('Cleanup completed!');
  }

  async seed() {
    await this.cleanupSeededData();
    await this.resetSequences();
    this.seededUsers = await this.seedUsers();
    await this.seedFriendships();
    await this.seedGifts();
    console.log('Seeding completed!');
  }

  private async seedUsers() {
    if (this.seededUsers.length > 0) {
      return this.seededUsers;
    }

    const savedUsers = [];
    
    // First save the core users
    for (const userData of this.SEED_DATA.users) {
      const taggedUserData = {
        ...userData,
        userName: `${userData.userName}_${this.SEEDER_TAG}`,
        lastSeen: new Date(),
      };

      const existingUser = await this.userRepository.findOne({
        where: { userId: userData.userId }
      });
      
      if (!existingUser) {
        try {
          const user = this.userRepository.create(taggedUserData);
          savedUsers.push(await this.userRepository.save(user));
        } catch (error) {
          console.log(`Failed to create user: ${error.message}`);
        }
      }
    }

    // Then generate and save 30 random users
    for (let i = 0; i < 50; i++) {
      const randomUserData = this.generateRandomUser(i);
      const taggedUserData = {
        ...randomUserData,
        userName: `${randomUserData.userName}_${this.SEEDER_TAG}`,
        lastSeen: new Date(),
      };

      try {
        const user = this.userRepository.create(taggedUserData);
        const savedUser = await this.userRepository.save(user);
        savedUsers.push(savedUser);

        // Create a gift for the random user
        const giftData = this.generateRandomGift();
        const currentYear = new Date().getFullYear();
        const endDate = new Date(savedUser.birthday);
        endDate.setFullYear(currentYear);
        endDate.setDate(endDate.getDate() + 1);
        if (endDate < new Date()) {
          endDate.setFullYear(currentYear + 1);
        }

        const gift = this.giftRepository.create({
          title: `${giftData.title} ${this.SEEDER_TAG}`,
          description: `${giftData.description} ${this.SEEDER_TAG}`,
          price: giftData.price,
          currency: giftData.currency,
          link: giftData.link,
          image: giftData.image,
          active: true,
          progress: 0,
          successful: false,
          endDate: endDate,
          user: savedUser
        });
        await this.giftRepository.save(gift);
      } catch (error) {
        console.log(`Failed to create random user: ${error.message}`);
      }
    }

    // Generate random relationships between random users and core users
    const coreUsers = savedUsers.slice(0, 3);
    const randomUsers = savedUsers.slice(3);
    await this.generateRandomRelationships(randomUsers, coreUsers);

    return savedUsers;
  }

  private async seedFriendships() {
    const users = this.seededUsers;
    if (users.length < 3) return;

    // Create friendships
    for (const { user, friend } of this.SEED_DATA.friendships) {
      const existingFriendship = await this.friendRepository.findOne({
        where: {
          user: { id: users[user].id },
          friend: { id: users[friend].id }
        }
      });

      if (!existingFriendship) {
        // Create bidirectional friendship
        const friendship1 = this.friendRepository.create({
          user: users[user],
          friend: users[friend],
        });
        const friendship2 = this.friendRepository.create({
          user: users[friend],
          friend: users[user],
        });
        await this.friendRepository.save([friendship1, friendship2]);
      }
    }

    // Create friend invitations
    for (const { sender, receiver } of this.SEED_DATA.friendInvitations) {
      const existingInvitation = await this.friendInvitationRepository.findOne({
        where: {
          sender: { id: users[sender].id },
          receiver: { id: users[receiver].id }
        }
      });

      if (!existingInvitation) {
        const invitation = this.friendInvitationRepository.create({
          sender: users[sender],
          receiver: users[receiver],
          status: 'PENDING',
        });
        await this.friendInvitationRepository.save(invitation);
      }
    }
  }

  private async seedGifts() {
    const users = this.seededUsers;
    if (users.length < 3) return;

    for (const giftData of this.SEED_DATA.gifts) {
      const taggedTitle = `${giftData.title} ${this.SEEDER_TAG}`;
      const existingGift = await this.giftRepository.findOne({
        where: { title: taggedTitle }
      });

      if (!existingGift) {
        const giftOwner = users[giftData.user];
        const currentYear = new Date().getFullYear();
        const endDate = new Date(giftOwner.birthday);
        endDate.setFullYear(currentYear);
        endDate.setDate(endDate.getDate() + 1);
        // If the date is in the past, use next year
        if (endDate < new Date()) {
          endDate.setFullYear(currentYear + 1);
        }

        const gift = this.giftRepository.create({
          title: taggedTitle,
          description: `${giftData.description} ${this.SEEDER_TAG}`,
          price: giftData.price,
          currency: giftData.currency,
          link: giftData.link,
          image: giftData.image,
          active: true,
          progress: 0,
          endDate: endDate,
          user: users[giftData.user]
        });
        const savedGift = await this.giftRepository.save(gift);

        if (giftData.contributor !== null && giftData.amount > 0) {
          const payment = this.giftPaymentRepository.create({
            gift: savedGift,
            user: users[giftData.contributor],
            amount: giftData.amount,
            currency: giftData.currency,
            source: this.SEEDER_TAG
          });
          await this.giftPaymentRepository.save(payment);
        }
      }
    }
  }
}