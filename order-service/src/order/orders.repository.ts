import { BaseRepository } from "src/common/repositories/base.repository";
import { Order } from "./entities/order.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async findWithsItems(id: string): Promise<Order | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['items'],
    }); 
  }

  async findByUser(userId: string): Promise<Order[]> {
  return this.repo.find({
      where: { user_id: userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findWithItems(id: string): Promise<Order | null> {
      return this.repo.findOne({
          where: { id },
          relations: ['items'],
      });
  }
}