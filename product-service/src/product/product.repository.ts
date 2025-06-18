import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/base.repository';

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
}