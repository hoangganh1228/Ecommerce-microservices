import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from 'src/common/dto/product-query.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants/pagination';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get()
    findAll(@Query() productQuery: ProductQueryDto) {
        return this.productService.findAll(productQuery);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: UpdateProductDto) {
        return this.productService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id)
    }

    
}
