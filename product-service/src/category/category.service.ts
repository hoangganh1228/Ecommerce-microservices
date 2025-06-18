import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { generateUniqueSlug } from 'src/utils/slug';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductRepository } from 'src/product/product.repository';
import { Product } from 'src/product/schemas/product.schema';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository, private readonly productRepository: ProductRepository) {}
    
    async create(dto: CreateCategoryDto): Promise<Category> {
        const slug = await generateUniqueSlug(dto.name, this.categoryRepository.categoryModel);
        return this.categoryRepository.create({ ...dto, slug });
    }

    async findAll(): Promise<Category[]> {
        let find = { 
            deleted: false 
        }
        return this.categoryRepository.findAll(find);
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        if (dto.name) {
            dto.slug = await generateUniqueSlug(dto.name, this.categoryRepository.categoryModel, id);
        }
        const updated = await this.categoryRepository.updateById(id, dto);
        if (!updated) throw new NotFoundException('Category not found');
        return updated;
    }

    async remove(id: string): Promise<void> {
        const result = await this.categoryRepository.softDelete(id);
        if (!result) throw new NotFoundException('Category not found');
    }

    async getAllChildCategoryIds(parentId: string): Promise<string[]> {
        const ids = [parentId];

        const children: any = await this.categoryRepository.findByParentId(parentId);     // need to fix early

        for(const child of children) {
            const subIds = await this.getAllChildCategoryIds(child._id.toString());
            ids.push(...subIds);
        }

        return ids;
    }

    async getCategoryTreeWithProducts(parentId: string): Promise<any[]> {

        const children: any = await this.categoryRepository.findByParentId(parentId);

        const result = await Promise.all(children.map(async (child) => {
            const [products, subTree] = await Promise.all([
                this.productRepository.findByCategoryIds([child._id.toString()]),
                this.getCategoryTreeWithProducts(child._id.toString())
            ])

            return {
                category: child,
                products,
                children: subTree,
            };
        }))

        return result;
    }

}   
