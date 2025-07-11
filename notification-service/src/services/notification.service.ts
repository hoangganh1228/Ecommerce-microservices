import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    try {
      const notification = this.notificationRepository.create(notificationData);
      const savedNotification = await this.notificationRepository.save(notification);

      this.logger.log(`Created notification ${savedNotification.id} for user ${notificationData.userId}`);
      return savedNotification;
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      throw error;
    }
  }

  async updateNotificationStatus(id: number, status: NotificationStatus): Promise<void> {
    try {
      await this.notificationRepository.update(id, { status });
      this.logger.log(`Updated notification ${id} status to ${status}`);
    } catch (error) {
      this.logger.error(`Failed to update notification ${id} status`, error);
      throw error;
    }
  }

  async getNotificationsByUserId(userId: number, status?: NotificationStatus): Promise<Notification[]> {
    const query = this.notificationRepository.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });

    if (status) {
      query.andWhere('notification.status = :status', { status });
    }

    return query.getMany();
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }
}