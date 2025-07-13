import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQService } from 'src/rabbitmq/services/rabbitmq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    HttpModule
  ],
  providers: [OrderService, OrdersRepository, RabbitMQService],
  controllers: [OrderController],
  exports: [OrdersRepository, RabbitMQService],
})
export class OrderModule {}
