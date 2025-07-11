import { ConsumeMessage } from './../../node_modules/@types/amqplib/properties.d';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from 'amqplib';
import { RABBITMQ_CONFIG } from "src/config/rabbitmq.config";


@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  async  onModuleInit() {
    await this.connect();
    await this.setupExchangesAndQueues(); 
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(RABBITMQ_CONFIG.url);
      this.channel = await this.connection.createChannel();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Error connecting to RabbitMQ', error);
    }
  }

  private async setupExchangesAndQueues() {
    try {
      // Declare exchanges
      await this.channel.assertExchange(
        RABBITMQ_CONFIG.exchanges.ORDERS,
        'topic',
        { durable: true }
      );

      // Declare queues
      await this.channel.assertExchange(
        RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
        'topic',
        { durable: true }
      );

      // Declare DLQ before main queue
      await this.channel.assertQueue(RABBITMQ_CONFIG.queues.NOTIFICATION_DLQ, {
        durable: true,
      });

      await this.channel.assertQueue(RABBITMQ_CONFIG.queues.ORDER_CREATED, {
        durable: true,  
        arguments: {
          'x-dead-letter-exchange': RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
          'x-dead-letter-routing-key': 'notification.dlq',
        },
      });
      // Create main queue
      await this.channel.assertQueue(RABBITMQ_CONFIG.queues.EMAIL_NOTIFICATION, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
          'x-dead-letter-routing-key': RABBITMQ_CONFIG.routingKeys.NOTIFICATION_RETRY,
        },
      });

      // Create retry queue
      await this.channel.assertQueue(RABBITMQ_CONFIG.queues.NOTIFICATION_RETRY, {
        durable: true,
        arguments: {
          'x-message-ttl': 60000, // Retry after 60 seconds
          'x-dead-letter-exchange': RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
          'x-dead-letter-routing-key': RABBITMQ_CONFIG.routingKeys.NOTIFICATION_RETRY,
        },
      });

      await this.channel.bindQueue(
        RABBITMQ_CONFIG.queues.ORDER_CREATED,
        RABBITMQ_CONFIG.exchanges.ORDERS,
        RABBITMQ_CONFIG.routingKeys.ORDER_CREATED
      );

      await this.channel.bindQueue(
        RABBITMQ_CONFIG.queues.EMAIL_NOTIFICATION,
        RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
        RABBITMQ_CONFIG.routingKeys.EMAIL_SEND
      );

      await this.channel.bindQueue(
        RABBITMQ_CONFIG.queues.NOTIFICATION_RETRY,
        RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
        RABBITMQ_CONFIG.routingKeys.NOTIFICATION_RETRY
      );

      await this.channel.bindQueue(
        RABBITMQ_CONFIG.queues.NOTIFICATION_DLQ,
        RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
        'notification.dlq'
      );



      this.logger.log('Exchanges and queues set up');
    } catch (error) {
      this.logger.error('Error setting up exchanges and queues', error);
    }
  }

  async publishMessage  (exchange: string, routingKey: string, message: any) {
    try {
      const msgBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.publish(
        exchange,
        routingKey,
        msgBuffer,
        { persistent: true, timestamp: Date.now(), messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
      );
      this.logger.log(`Message published to ${exchange} with routing key ${routingKey}`);
      } catch (error) {
        this.logger.error('Error publishing message', error);
      }
  }
  async   Message(
    queueName: string, 
    onMessage: (message: any) => Promise<void>
  ): Promise<void> {
    try {
      await this.channel.consume(queueName, async (msg) => {
        if (msg) {
          let messageContent: any;
          try {
            messageContent = JSON.parse(msg.content.toString());
            await onMessage(messageContent);
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error(`Error processing message from ${queueName}`, error);
            
            // Retry logic
            const retryCount = (msg.properties.headers?.['x-retry-count'] || 0) + 1;
            
            if (retryCount <= 3) {
              // Gửi vào retry queue
              await this.publishMessage(
                RABBITMQ_CONFIG.exchanges.NOTIFICATIONS,
                RABBITMQ_CONFIG.routingKeys.NOTIFICATION_RETRY,
                {
                  ...messageContent,
                  retryCount
                }
              );
              this.logger.log(`Message sent to retry queue, attempt ${retryCount}`);
            } else {
              this.logger.error(`Max retries exceeded for message from ${queueName}`);
            }
            
            this.channel.nack(msg, false, false);
          }
        }
      });
      
      this.logger.log(`Started consuming messages from ${queueName}`);
    } catch (error) {
      this.logger.error(`Failed to consume messages from ${queueName}`, error);
      throw error;
    }
  }
  // Getter cho channel (để test)
  getChannel(): amqp.Channel {
    return this.channel;
  }
}
    