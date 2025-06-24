import { BaseRepository } from "src/common/repositories/base.repository";
import { Order } from "./entities/order.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
    constructor(
        @InjectRepository(Order)
        repo: Repository<Order>
    ){
        super(repo);
    } 

    async findByUser(userId: string): Promise<Order[]> {
    return this.repo.find({
        where: { user_id: userId },
        relations: ['items'],
        });
    }

    async findWithItems(id: string): Promise<Order | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['items'],
        });
    }
}