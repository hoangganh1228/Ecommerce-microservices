import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of, timeout } from 'rxjs'
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from 'src/rabbitmq/services/rabbitmq.service';
import { RABBITMQ_CONFIG } from 'src/config/rabbitmq.config';
import { OrderCreatedEventDto, OrderUpdatedEventDto } from 'src/rabbitmq/dto/order-event.dto';

@Injectable()
export class OrderService {
  private userServiceUrl: string;
  private productServiceUrl: string;

  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitMQService,
    private readonly httpService: HttpService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL')!;
    this.productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL')!;
  }
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // const userUrl = `${this.userServiceUrl}/${createOrderDto.user_id}`;
    // try {
    //   const res = await firstValueFrom(this.httpService.get(userUrl));
    //   if (!res.data) throw new BadRequestException('Invalid user');
    // } catch (error) {
    //   throw new BadRequestException('User does not exist');
    // }

    // for (const item of createOrderDto.items) {
    //   const productUrl = `${this.productServiceUrl}/${item.product_id}`;
    //   console.log(productUrl);
    //   try {
    //     const res = await firstValueFrom(
    //       this.httpService.get(productUrl).pipe(
    //         timeout(2000), // limit 2s
    //         catchError((error) => {
    //           console.error(`Product service error:`, error.message || error);
    //           return of({ data: null }); 
    //         }),
    //       )
    //     );

    //     if (!res.data) throw new BadRequestException(`Invalid product ${item.product_id}`);
    //   } catch (err) {
    //     throw new BadRequestException(`Product ${item.product_id} not found`);
    //   }
    // }
    try {
      if (!createOrderDto.total_price || createOrderDto.total_price <= 0) {
        const total = createOrderDto.items.reduce((sum, item) => sum + item.final_price, 0);
        console.log(total);
        createOrderDto.total_price = total;
      }
      const order = await this.ordersRepo.create(createOrderDto);
      await this.publishOrderCreatedEvent( order);
      return order;
    } catch (error) {
      throw new BadRequestException('Error validating order data');
    }
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const existing = await this.ordersRepo.findById(id);
    if (!existing) throw new NotFoundException(`Order with id ${id} not found`);

    const oldStatus = existing.status;
    const updatedOrder = await this.ordersRepo.update(id, { status });
    if(updatedOrder && oldStatus !== status) {
      await this.publishOrderUpdatedEvent(updatedOrder, oldStatus, status);
    }
    return updatedOrder;
  }

  private async publishOrderCreatedEvent(order: Order): Promise<void> {
    try {
      // Tạo event data để gửi đến notification service
      const eventData: OrderCreatedEventDto = {
        orderId: order.id,
        userId: order.user_id,
        userEmail: 'user@example.com', // TODO: Lấy từ user service
        userName: 'User Name',          // TODO: Lấy từ user service
        orderTotal: Number(order.total_price),
        orderItems: order.items?.map(item => ({
          productId: item.product_id,
          productName: item.product_name,
          productPrice: Number(item.product_price),
          quantity: item.quantity,
          finalPrice: Number(item.final_price)
        })) || [],
        shippingAddress: 'Default Address', // TODO: Lấy từ user service
        note: order.note,
        createdAt: order.createdAt.toISOString(),
        status: order.status
      };

      // Gửi event với routing key 'order.created'
      await this.rabbitmqService.publishOrderEvent(
        RABBITMQ_CONFIG.routingKeys.ORDER_CREATED,
        eventData
      );

    } catch (error) {
      // Log lỗi nhưng không throw để không ảnh hưởng đến việc tạo order
      console.error('Failed to publish order created event:', error);
    }
  }

  // ** Method mới: Publish order updated event **
  private async publishOrderUpdatedEvent(
    order: Order, 
    oldStatus: string, 
    newStatus: string
  ): Promise<void> {
    try {
      const eventData: OrderUpdatedEventDto = {
        orderId: order.id,
        userId: order.user_id,
        userEmail: 'user@example.com', // TODO: Lấy từ user service
        oldStatus,
        newStatus,
        updatedAt: new Date().toISOString()
      };

      // Gửi event với routing key 'order.updated'
      await this.rabbitmqService.publishOrderEvent(
        RABBITMQ_CONFIG.routingKeys.ORDER_UPDATED,
        eventData
      );

    } catch (error) {
      console.error('Failed to publish order updated event:', error);
    }
  }


  async findAll(): Promise<Order[]> {
    return this.ordersRepo.findAll();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findWithItems(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order | null> {
    const existing = await this.ordersRepo.findById(id);
    if (!existing) throw new NotFoundException(`Order with id ${id} not found`);

    return this.ordersRepo.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.ordersRepo.findById(id);
    if (!existing) throw new NotFoundException(`Order with id ${id} not found`);

    return this.ordersRepo.delete(id);
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepo.findByUser(userId);
  }
  
}
