import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RABBITMQ_CONFIG } from "src/config/rabbitmq.config";
import { OrderCreatedDto } from "src/dto/order-created.dto";
import { EmailService } from "src/services/email.service";
import { NotificationService } from "src/services/notification.service";
import { RabbitMQService } from "src/services/rabbitmq.service";

@Injectable()
export class OrderConsumer implements OnModuleInit {
    private readonly logger = new Logger();
    
    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly emailService: EmailService,
        private readonly notificationService: NotificationService
    ) {}

    async onModuleInit() {
        await this.startOrderConsumer()
    }

    private async startOrderConsumer() {
        await this.rabbitMQService.consumeMessage(
            RABBITMQ_CONFIG.queues.ORDER_CREATED,
            this.handleOrderCreated.bind(this)
        )
    }

    async handleOrderCreated(orderData: OrderCreatedDto) {
        try {
            this.logger.log(`Processing order created event: ${orderData.orderId}`);
        
            const notification = await new this.notificationService.createNotification({
                userId: orderData.userId,
                type: NotificationType.EMAIL,
                target: orderData.userEmail,
                title: `Xác nhận đơn hàng #${orderData.orderId}`,
                message: `Đơn hàng #${orderData.orderId} đã được tạo thành công`,
                status: NotificationStatus.QUEUED,
                orderId: orderData.orderId,
                metadata: {
                    orderTotal: orderData.orderTotal,
                    orderItems: orderData.orderItems,
                    shippingAddress: orderData.shippingAddress
                }
            })

            const emailNotification: EmailNotificationDto = {
              notificationId: notification.id,
              to: orderData.userEmail,
              subject: `Xác nhận đơn hàng #${orderData.orderId}`,
              template: 'order_confirmation',
              data: {
                userName: orderData.userName,
                orderId: orderData.orderId,
                orderTotal: orderData.orderTotal,
                orderItems: orderData.orderItems,
                shippingAddress: orderData.shippingAddress,
                orderDate: new Date(orderData.createdAt).toLocaleDateString('vi-VN')
              },
              userId: orderData.userId,
              orderId: orderData.orderId,
              type: 'order_confirmation'
            };

        } catch (error) {
            
        }
    }
}