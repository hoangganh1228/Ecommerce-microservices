import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as amqp from 'amqplib';
import { RABBITMQ_CONFIG } from "src/config/rabbitmq.config";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: any = null;
  private channel: any = null;

  async onModuleInit() {
      await this.connect();
      await this.setupExchanges();
  }

  async onModuleDestroy() {
      try {
        if (this.channel) {
          await this.channel.close();
        }
        if (this.connection) {
          await this.connection.close();
        }
      } catch (error) {
        this.logger.error('Error closing RabbitMQ connection', error);
      }
  }

  private async connect() {
      try {
          this.connection = await amqp.connect(RABBITMQ_CONFIG.url);
          this.channel = await this.connection.createChannel();
          await this.channel.prefetch(1); // Set prefetch count to 1 for fair dispatch
          this.logger.log('Connected to RabbitMQ');
      } catch (error) {
          this.logger.error('Error connecting to RabbitMQ', error);
          throw error;
      }
  }

  private async setupExchanges() {
    try {
      if (!this.channel) {
        throw new Error('Channel not initialized');
      }
      
      await this.channel.assertExchange(
        RABBITMQ_CONFIG.exchanges.ORDERS,
        'topic',
        { durable: true }
      );
      this.logger.log(`Exchange ${RABBITMQ_CONFIG.exchanges.ORDERS} created`);
    } catch (error) {
      this.logger.error('Error setting up RabbitMQ exchanges', error);
      throw error;
    }
  }

  async publishOrderEvent(routingKey: string, orderData: any) {
    try {
      if (!this.channel) {
        throw new Error('Channel not initialized');
      }

      const message = {
        ...orderData,
        timestamp: new Date().toISOString(),
        eventId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      await this.channel.publish(
        RABBITMQ_CONFIG.exchanges.ORDERS,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { 
          persistent: true,
          timestamp: Date.now(),
          messageId: message.eventId
        }
      );
      this.logger.log(`Published order event with routing key ${routingKey}`);
    } catch (error) {
      this.logger.error(`Failed to publish order event with routing key ${routingKey}`, error);
      throw error;
    }  
  }
}