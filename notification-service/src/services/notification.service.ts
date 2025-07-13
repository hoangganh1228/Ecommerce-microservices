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

  async getNotificationsByUser(userId: number, limit: number = 20): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
      });
    } catch (error) {
      this.logger.error(`Failed to get notifications for user ${userId}`, error);
      throw error;
    }
  }
  
  async getUnreadCount(userId: number): Promise<number> {
    try {
      return await this.notificationRepository.count({
        where: {userId, isRead: false}
      })
    } catch (error) {
      this.logger.error(`Failed to get unread count for user ${userId}`, error);
      throw error;
    }
  }

  async deleteOldNotifications(days: number = 30): Promise<number> {
    try {
      const cutOfDate = new Date();
      cutOfDate.setDate(cutOfDate.getDate() - days);

      const result = await this.notificationRepository
        .createQueryBuilder()
        .delete()
        .where('createdAt < :cutOfDate', { cutOfDate })
        .andWhere('status = :status', {status: NotificationStatus.SENT})
        .execute()

      this.logger.log(`Deleted ${result.affected} old notifications`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Failed to delete old notifications', error);
      throw error;
    }

  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      await this.notificationRepository.update(id, { isRead: true });
      this.logger.log(`Marked notification ${id} as read`);
    } catch (error) {
      this.logger.error(`Failed to mark notification ${id} as read`, error);
      throw error;
    }
  }
}