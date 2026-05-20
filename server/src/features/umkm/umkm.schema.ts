import { z } from "zod";

export const registerUmkmSchema = z.object({
  owner_name: z.string().min(1, "Nama pemilik wajib diisi"),
  nib: z
    .string()
    .min(1, "NIB wajib diisi")
    .regex(/^\d{13}$/, "NIB harus 13 digit angka"),
  business_name: z.string().min(1, "Nama usaha wajib diisi"),
  business_category: z.string().min(1, "Kategori usaha wajib diisi"),
  employee_count: z.coerce.number().min(1, "Jumlah karyawan minimal 1"),
  established_at: z.coerce
    .number()
    .int()
    .gte(1886, "Tahun berdiri tidak boleh sebelum 1886")
    .lte(
      new Date().getFullYear() + 1,
      "Tahun berdiri tidak boleh di masa depan",
    ),
  province: z.string().min(1, "Provinsi wajib diisi"),
  regency: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  district: z.string().min(1, "Kecamatan wajib diisi"),
  subdistrict: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  website_sosmed: z
    .string()
    .url("Format URL tidak valid")
    .optional()
    .or(z.literal("")),
  business_email: z.string().email("Format email tidak valid"),
  business_phone: z.string().min(1, "Nomor telepon wajib diisi"),
});

export type RegisterUmkmInput = z.infer<typeof registerUmkmSchema>;
