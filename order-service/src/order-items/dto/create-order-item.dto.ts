import { IsInt, IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
    @IsInt()CreateOrderItemDto
    product_id: number;

    @IsString()
    product_name: string;

    @IsNumber()
    product_price: number;

    @IsInt()
    quantity: number;

    @IsNumber()
    final_price: number;
}
