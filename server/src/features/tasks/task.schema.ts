import { z } from "zod";

// FIX: Hapus wrapper 'body' karena middleware validate() langsung parse req.body,
// bukan req. Sebelumnya schema { body: z.object({...}) } menyebabkan
// "expected object, received undefined" karena req.body !== req.body.body
export const submitTaskSchema = z.object({
  submission_link: z
    .string()
    .min(1, "Link hasil kerja wajib diisi")
    .url("Format link tidak valid (harus berupa URL)"),
  note: z.string().optional(),
});

export const reviewTaskSchema = z
  .object({
    is_approved: z.boolean(),
    revision_note: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        !data.is_approved &&
        (!data.revision_note || data.revision_note.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Catatan revisi wajib diisi jika tugas ditolak/perlu direvisi",
      path: ["revision_note"],
    },
  );

export type SubmitTaskInput = z.infer<typeof submitTaskSchema>;
export type ReviewTaskInput = z.infer<typeof reviewTaskSchema>;
