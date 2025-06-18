import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsMongoId()
  @IsOptional()
  parent_id?: string;
}