export const RABBITMQ_CONFIG = {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672', 
    exchanges: {
        ORDERS: 'orders.exchange',
        NOTIFICATIONS: 'notifications.exchange'
    },
    queues: {
        ORDER_CREATED: 'order.created.queue',
        ORDER_UPDATED: 'order.updated.queue',
        ORDER_CANCELLED: 'order.cancelled.queue',

        // NOTIFICATION
        EMAIL_NOTIFICATION: 'email.notification.queue',
        NOTIFICATION_RETRY: 'notification.retry.queue',
        NOTIFICATION_DLQ: 'notification.dlq.queue'
    },
    routingKeys: {
        ORDER_CREATED: 'order.created',
        ORDER_UPDATED: 'order.updated',
        ORDER_CANCELLED: 'order.cancelled',
        
        EMAIL_SEND: 'notification.email.send',
        NOTIFICATION_RETRY: 'notification.retry',
        NOTIFICATION_DLQ: 'notification.dlq'
    }
}