import { IsInt, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';

export class CreateOrderDto {
  @IsInt()
  user_id: number;

  @IsOptional()
  @IsInt()
  voucher_id?: number;

  @IsEnum(['pending', 'completed', 'cancelled'])
  status: 'pending' | 'completed' | 'cancelled';

  @IsInt()
  total_price: number;

  @IsOptional()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
