export class EmailNotificationDto {
  notificationId?: number;
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
  userId: number;
  orderId?: number;
  type: 'order_confirmation' | 'order_shipped' | 'order_delivered' | 'order_cancelled';
}