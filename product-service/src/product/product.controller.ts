import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from 'src/common/pagination/product-query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from 'src/common/image/image-upload.service';

@Controller('products')
export class ProductController {
    constructor(
        private readonly imageUploadService: ImageUploadService,
        private readonly productService: ProductService,
    ){}

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: CreateProductDto,
    ) {
        await this.imageUploadService.attachImages(dto, files);
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
    @UseInterceptors(FilesInterceptor('images'))
    async update(@Param('id') id: string, @Body() data: UpdateProductDto, @UploadedFiles() files: Express.Multer.File[],) {
        await this.imageUploadService.attachImages(data, files);
        return this.productService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id)
    }

    
}
