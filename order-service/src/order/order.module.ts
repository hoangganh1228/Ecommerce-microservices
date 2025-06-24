import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    HttpModule
  ],
  providers: [OrderService, OrdersRepository],
  controllers: [OrderController],
  exports: [OrdersRepository],
})
export class OrderModule {}
