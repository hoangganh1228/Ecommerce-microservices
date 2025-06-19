import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    quantity: number;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsMongoId()
    @IsOptional()
    category_id?: string;

    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    active: boolean;
}