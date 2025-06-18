import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/base/base.repository';

export class CategoryRepository extends BaseRepository<Category> {
    constructor(
        @InjectModel(Category.name) public readonly categoryModel: Model<Category>,
    ) {
        super(categoryModel);
    }

    async findByParentId(parentId: string): Promise<Category[]> {
        return await this.categoryModel.find({ parent_id: parentId }).lean();
    } 
}