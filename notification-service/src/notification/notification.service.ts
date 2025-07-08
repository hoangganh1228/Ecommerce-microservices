import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Repository } from 'typeorm/repository/Repository';
import { FindManyOptions } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  create(data: Partial<CreateNotificationDto>): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    const options: FindManyOptions<Notification> = {
      where: { userId },
      order: { createdAt: 'DESC' },
    };
    return this.notificationRepository.find(options);
  }
}
