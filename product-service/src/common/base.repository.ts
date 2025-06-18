import { Model, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(protected  readonly model: Model<T>) {}

  async create(data: any): Promise<T> {
    const created = new this.model(data);
    return created.save();
  }

  async findAll(find): Promise<T[]> {
    return this.model.find(find).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, data: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { deleted: true, deleted_at: new Date() }, { new: true })
      .exec();
  }
}