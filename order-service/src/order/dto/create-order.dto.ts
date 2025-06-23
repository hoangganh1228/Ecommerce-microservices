import { IsInt, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsInt()
  user_id: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsInt()
  total_price: number;

  @IsOptional()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
