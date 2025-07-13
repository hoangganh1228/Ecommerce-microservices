import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { EmailService } from "src/services/email.service";
import { NotificationService } from "src/services/notification.service";

@Controller('notifications')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly emailService: EmailService
    ) {}

    @Get('user/:userId')
    async getUserNotifications(
        @Param('userId') userId: number,
        @Query('limit') limit: number = 20,
    ){
        return this.notificationService.getUnreadCount(userId)
    }

    @Put(':id/mark-read')
    async markAsRead(@Param('id') id: number) {
        await this.notificationService.markAsRead(id);
        return { message: 'Notification marked as read' }
    }

    @Post('test-email')
    async testEmail(@Body() body: { email: string; orderId: number }) {
        const testEmailData = {
        to: body.email,
        subject: 'Test Email',
        template: 'order_confirmation',
        data: {
            userName: 'Test User',
            orderId: body.orderId,
            orderTotal: 100000,
            orderItems: [
            { productName: 'Test Product', quantity: 1, price: 100000 }
            ],
            shippingAddress: '123 Test Street, Test City',
            orderDate: new Date().toLocaleDateString('vi-VN')
        },
        userId: 1,
        orderId: body.orderId,
        type: 'order_confirmation' as const
        };

        await this.emailService.sendEmail(testEmailData);
        return { message: 'Test email sent successfully' };
    }

    @Get('health/email')
    async checkEmailHealth() {
        const isHealthy = await this.emailService.testConnection();
        return { status: isHealthy ? 'healthy' : 'unhealthy' };
    }

}
