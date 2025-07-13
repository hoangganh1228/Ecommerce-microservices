import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controllers/notification.controller';
import { RabbitMQService } from './services/rabbitmq.service';
import { EmailService } from './services/email.service';
import { NotificationService } from './services/notification.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Notification])
  ],
  controllers: [NotificationController],
  providers: [
    RabbitMQService,
    EmailService,
    NotificationService,
    
  ],
})
export class AppModule {}
