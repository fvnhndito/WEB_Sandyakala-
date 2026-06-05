import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(1, "Fullname tidak boleh kosong"),
  email: z
    .string()
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
