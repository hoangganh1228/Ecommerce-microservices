import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { generateUniqueSlug } from '../utils/slug';
import { ProductRepository } from './product.repository';
import { buildMongooseQuery, MongooseQuery } from 'src/utils/build-mongoose-query';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async create(dto: CreateProductDto): Promise<Product> {
        const slug = await generateUniqueSlug(dto.name, this.productRepository.productModel);
        const product = await this.productRepository.create({ ...dto, slug });
        return product;
    }
    
    async findAll(query: MongooseQuery): Promise<PaginationResult<Product>> {
        const { where, skip, limit, sort, page } = buildMongooseQuery(query);

        const [data, total] = await this.productRepository.findAndCount({ where, skip, limit, sort });

        return {
            data,
            meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            },
        };
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
