import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of, timeout } from 'rxjs'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  private userServiceUrl: string;
  private productServiceUrl: string;

  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly configService: ConfigService,
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

    for (const item of createOrderDto.items) {
      const productUrl = `${this.productServiceUrl}/${item.product_id}`;
      try {
        const res = await firstValueFrom(
          this.httpService.get(productUrl).pipe(
            timeout(2000), // limit 2s
            catchError((error) => {
              console.error(`Product service error:`, error.message || error);
              return of({ data: null }); 
            }),
          )
        );

        if (!res.data) throw new BadRequestException(`Invalid product ${item.product_id}`);
      } catch (err) {
        throw new BadRequestException(`Product ${item.product_id} not found`);
      }
    }

    if (!createOrderDto.total_price || createOrderDto.total_price <= 0) {
      const total = createOrderDto.items.reduce((sum, item) => sum + item.final_price, 0);
      createOrderDto.total_price = total;
    }
    return this.ordersRepo.create(createOrderDto);
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

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const existing = await this.ordersRepo.findById(id);
    if (!existing) throw new NotFoundException(`Order with id ${id} not found`);

    return this.ordersRepo.update(id, { status });
  }
}
