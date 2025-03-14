import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeders/seeder.module';
import { SeederService } from './seeders/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seeder = app.get(SeederService);

  const command = process.argv[2];

  try {
    switch (command) {
      case 'cleanup':
        await seeder.cleanup();
        break;
      case 'seed':
        await seeder.seed();
        break;
      default:
        console.log('Please specify a command: "cleanup" or "seed"');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await app.close();
  }
}

bootstrap(); 