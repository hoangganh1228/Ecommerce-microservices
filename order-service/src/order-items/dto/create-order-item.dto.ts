import { IsInt, IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
    @IsInt()
    product_id: number;

    @IsString()
    product_name: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    product_price: number;

    @IsInt()
    quantity: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    final_price: number;
}
