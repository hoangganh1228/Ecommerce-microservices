import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/base/base.repository';

export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectModel(Product.name) public readonly productModel: Model<Product>,
  ) {
    super(productModel);
  }

  async findByCategoryIds(categoryIds: string[]): Promise<Product[]> {
    return this.productModel.find({
      category_id: { $in: categoryIds },
      deleted: false,
      active: true
    })
  }

  async findAndCount(options: {
    where: any;
    skip: number;
    limit: number;
    sort: Record<string, 1 | -1>;
  }): Promise<[Product[], number]> {
    const { where, skip, limit, sort } = options;

    const [data, total] = await Promise.all([
      this.productModel.find(where).skip(skip).limit(limit).sort(sort).exec(),
      this.productModel.countDocuments(where),
    ]);

    return [data, total];
  }
}