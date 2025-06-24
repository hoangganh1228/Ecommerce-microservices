import { Repository, FindOptionsWhere, ObjectLiteral, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repo.find();
  }

  async findById(id: string | number): Promise<T | null> {
    return this.repo.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async update(id: string | number, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string | number): Promise<void> {
    await this.repo.delete(id);
  }
}
