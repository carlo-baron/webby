import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3).max(10),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      {
        message:
          "Password must include uppercase, lowercase, number and a special character.",
      }
    ),
});
