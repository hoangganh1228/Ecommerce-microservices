import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
    constructor(private readonly ordersRepo: OrdersRepository) {}
    async create(createOrderDto: CreateOrderDto): Promise<Order> {
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
