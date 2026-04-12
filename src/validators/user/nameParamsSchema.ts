import { z } from "zod";

export const NameSchema = z.string().min(1).max(10);

export const NameParamsSchema = z.object({
  name: NameSchema,
});
