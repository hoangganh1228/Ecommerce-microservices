import { DEFAULT_LIMIT, DEFAULT_PAGE } from "src/common/constants/pagination";

export interface MongooseQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export function buildMongooseQuery(query: MongooseQuery, ALLOWED_SORT_FIELDS = ['name', 'price', 'createdAt']) {
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
        where.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    const sort: Record<string, 1 | -1> = {};

    const sortFields = Array.isArray(sortBy) ? sortBy : String(sortBy).split(',');
    
    const sortOrders = Array.isArray(sortOrder) ? sortOrder : String(sortOrder).split(',');

    sortFields.forEach((field, idx) => {
        if (ALLOWED_SORT_FIELDS.includes(field)) {
            const order = sortOrders[idx] || 'desc';
            sort[field] = order === 'asc' ? 1 : -1;
        }
    });

    return { where, skip, limit, sort, page };
}