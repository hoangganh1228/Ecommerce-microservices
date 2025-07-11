export const RABBITMQ_CONFIG = {
    url: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
    exchanges: {
        ORDERS: 'orders.exchange',
        NOTIFICATIONS: 'notification.exchange',
    },
    queues: {
        ORDER_CREATED: 'order.created.queue',
        EMAIL_NOTIFICATION: 'email.notification.queue',
        NOTIFICATION_RETRY: 'notification.retry.queue',
        NOTIFICATION_DLQ: 'notification.dlq.queue'
    },
    routingKeys: {
        ORDER_CREATED: 'order.created',
        EMAIL_SEND: 'email.send',
        NOTIFICATION_RETRY: 'notification.retry'
    }
}