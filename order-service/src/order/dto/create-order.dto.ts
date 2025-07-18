import { IsOptional, IsEnum, IsArray, ValidateNested, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsString()
  user_id: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  total_price: number;

  @IsOptional()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
