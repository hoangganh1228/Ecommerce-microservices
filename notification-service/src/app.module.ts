import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'notification-service',
      synchronize: true,
      autoLoadEntities: true,
      entities: [Notification],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
