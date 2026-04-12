import { z } from "zod";

export const PaginationQuerySchema = z.object({
	page: z.coerce.number().default(1),
	limit: z.coerce.number().min(5).max(50).default(5)
});
