import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    @Post()
    create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }

    @Get(':id/nested-products')
    async getCategoryTreeWithProducts(@Param('id') id: string) {
        return this.categoryService.getCategoryTreeWithProducts(id);
    }
}
