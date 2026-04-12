import { z } from "zod";
import { NameSchema } from './nameParamsSchema.js';

export const UpdateNameBodySchema = z.object({
  name: NameSchema,
  new_name: NameSchema,
});
