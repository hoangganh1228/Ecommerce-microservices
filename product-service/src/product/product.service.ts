import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { generateUniqueSlug } from '../utils/slug';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async create(dto: CreateProductDto): Promise<Product> {
        const slug = await generateUniqueSlug(dto.name, this.productRepository.productModel);
        const product = await this.productRepository.create({ ...dto, slug });
        return product;
    }
    
    async findAll(): Promise<Product[]> {
        let find = {
            deleted: false
        }
        const products = await this.productRepository.findAll(find);
        return products;
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if(!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(id: string, data: UpdateProductDto): Promise<Product> {
        if(data.name) {
            data.slug = await generateUniqueSlug(data.name, this.productRepository.productModel, id);
        }
        const product = await this.productRepository.updateById(id, data);
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async remove(id: string): Promise<void> {
        const result = await this.productRepository.softDelete(id);
        
        if (!result) throw new NotFoundException('Product not found');
    }
}
