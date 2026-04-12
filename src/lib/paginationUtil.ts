import { PaginationQuerySchema } from '#root/validators/paginationQuerySchema.js';
import type { Request } from 'express';

export function paginate(req: Request){
	const { page, limit } = PaginationQuerySchema.parse(req.query);
	const skip = (page - 1) * limit;

	return { skip, limit };
}
