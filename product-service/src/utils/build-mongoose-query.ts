import { DEFAULT_LIMIT, DEFAULT_PAGE } from "src/common/constants/pagination";

export interface MongooseQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export function buildMongooseQuery(query: MongooseQuery) {
    const {
        page = DEFAULT_PAGE,
        limit = DEFAULT_LIMIT,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        filters = {},
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {
        deleted: false,
        ...filters,
    };

    if(search) {
        where.name = { $regex: search, $options: 'i' };
    }

    const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === 'asc' ? 1 as 1 : -1 as -1,
    };

    return { where, skip, limit, sort, page };
}