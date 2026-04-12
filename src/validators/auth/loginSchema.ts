import { z } from "zod";

export const LoginSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1)
});
