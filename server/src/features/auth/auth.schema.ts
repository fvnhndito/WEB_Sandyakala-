import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string("Fullname wajib diisi")
    .min(1, "Fullname tidak boleh kosong"),
  email: z.string("Email wajib diisi").email("Format email tidak valid"),
  password: z
    .string("Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z.string("Email wajib diisi").email("Format email tidak valid"),
  password: z
    .string("Password wajib diisi")
    .min(1, "Password tidak boleh kosong"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
