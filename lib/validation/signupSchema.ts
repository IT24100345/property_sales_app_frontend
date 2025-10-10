import { z } from "zod";

export const signupSchema = z.object({
  email: z.email().max(100),
  username: z.string().min(2).max(100),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
  role: z.enum(["ROLE_ADMIN", "ROLE_USER"]),
});
