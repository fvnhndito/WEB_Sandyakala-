import { z } from "zod";

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const createJobSchema = z
  .object({
    title: z.string().min(1, "Judul lowongan wajib diisi"),
    job_category: z.string().min(1, "Bidang pekerjaan wajib diisi"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    type: z.enum(["SHIFT", "PROJECT"]),
    salary_min: z.coerce.number().min(1, "Gaji minimal wajib diisi"),
    salary_max: z.coerce
      .number()
      .min(1, "Gaji maksimal wajib diisi"),
    worker_needed: z.coerce.number().int().min(1, "Minimal butuh 1 pekerja"),
    deadline: z.coerce
      .date()
      .refine(
        (date: Date) => date > new Date(),
        "Deadline harus lebih maju dari hari ini",
      ),
    minimum_education: z.string().min(1, "Pendidikan minimum wajib diisi"),
    qualification_description: z.string().min(1, "Kualifikasi wajib diisi"),
    portfolio_requirement: z.enum(["REQUIRED", "OPTIONAL"]),

    skills: z.array(z.string()).min(1, "Isi minimal 1 keahlian"),

    shifts: z.array(z.enum(["PAGI", "SIANG", "MALAM"])).optional(),
    project_tasks: z
      .array(
        z
          .object({
            task_name: z.string().min(1, "Nama tugas wajib diisi"),
            task_order: z.number().int(),
            project_start: z
              .string()
              .min(1, "Tanggal mulai wajib diisi")
              .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Format tanggal mulai harus YYYY-MM-DD",
              ),
            project_end: z
              .string()
              .min(1, "Tanggal berakhir wajib diisi")
              .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Format tanggal selesai harus YYYY-MM-DD",
              ),
          })
          .refine(
            (data: { project_start: string }) => {
              const today = getTodayString();
              return data.project_start >= today;
            },
            {
              message:
                "Tanggal mulai tidak boleh di masa lalu (minimal hari ini)",
              path: ["project_start"],
            },
          )
          .refine(
            (data: { project_start: string; project_end: string }) => {
              return data.project_end >= data.project_start;
            },
            {
              message:
                "Tanggal selesai tidak boleh lebih cepat dari tanggal mulai",
              path: ["project_end"],
            },
          ),
      )
      .optional(),
  })
  .superRefine((data: any, ctx: z.RefinementCtx) => {
    if (data.type === "SHIFT" && data.project_tasks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tipe SHIFT tidak boleh memiliki project tasks",
        path: ["project_tasks"],
      });
    }

    if (data.type === "PROJECT" && data.shifts) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tipe PROJECT tidak boleh memiliki shift",
        path: ["shifts"],
      });
    }

    if (data.type === "SHIFT" && (!data.shifts || data.shifts.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Untuk tipe SHIFT, jam shift wajib dipilih",
        path: ["shifts"],
      });
    }

    // custom validation.
    if (
      data.type === "PROJECT" &&
      (!data.project_tasks || data.project_tasks.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Untuk tipe PROJECT, milestone/tugas wajib diisi",
        path: ["project_tasks"],
      });
    }

    if (
      data.salary_min !== undefined &&
      data.salary_max !== undefined &&
      data.salary_min > data.salary_max
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Salary minimum tidak boleh lebih besar dari salary maksimum",
        path: ["salary_min"],
      });
    }

    if (data.project_tasks) {
      const orders = data.project_tasks.map((t: { task_order: number }) => t.task_order);
      const uniqueOrders = new Set(orders);

      if (orders.length !== uniqueOrders.size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Urutan task tidak boleh duplikat",
          path: ["project_tasks"],
        });
      }
    }
  });

export type CreateJobInput = z.infer<typeof createJobSchema>;
