import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import { Card } from "@/features/umkm/components/ui/Card";
import { Button } from "@/shared/components/ui/button";
import { FiArrowLeft, FiArrowRight, FiX, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createJobSchema,
  type CreateJobInput,
} from "../../../../server/src/features/jobs/job.schema";
import { useEffect, useState } from "react";
import { apiRequest } from "@/shared/lib/api";

const steps = [
  { id: 1, name: "Informasi Lowongan" },
  { id: 2, name: "Kualifikasi" },
  { id: 3, name: "Publikasi" },
];

const InputField = ({
  label,
  placeholder,
  type = "text",
  error,
  ...props
}: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[14px] font-bold text-gray-800">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
      {...props}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

export default function AddLowonganPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<
    ("PAGI" | "SIANG" | "MALAM")[]
  >(["PAGI"]);
  const [portfolio, setPortfolio] = useState<"REQUIRED" | "OPTIONAL">(
    "REQUIRED",
  );
  const [salaryMinDisplay, setSalaryMinDisplay] = useState("");
  const [salaryMaxDisplay, setSalaryMaxDisplay] = useState("");
  const [tasks, setTasks] = useState([
    { task_name: "", task_order: 1, project_start: "", project_end: "" },
  ]);

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema as any),
    mode: "onChange",
    defaultValues: {
      type: "PROJECT",
      project_tasks: [
        { task_name: "", task_order: 1, project_start: "", project_end: "" },
      ],
    },
  });

  const jobType = watch("type");

  useEffect(() => {
    register("project_tasks");
  }, [register]);

  const formatRupiah = (v: string) =>
    v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const parseRupiah = (v: string) => v.replace(/\./g, "");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const updated = [...skills, trimmed];
    setSkills(updated);
    setValue("skills", updated, { shouldValidate: true });
    setSkillInput("");
    setShowSkillInput(false);
  };

  const removeSkill = (i: number) => {
    const updated = skills.filter((_, idx) => idx !== i);
    setSkills(updated);
    setValue("skills", updated, { shouldValidate: true });
  };

  const toggleShift = (jam: "PAGI" | "SIANG" | "MALAM") => {
    setSelectedShifts((prev) => {
      if (prev.includes(jam)) {
        if (prev.length === 1) {
          return prev;
        }

        return prev.filter((item) => item !== jam);
      }

      return [...prev, jam];
    });
  };

  const handleTaskChange = (index: number, field: string, value: string) => {
    const newTasks = tasks.map((t, i) =>
      i === index ? { ...t, [field]: value } : t,
    );
    setTasks(newTasks);
    setValue("project_tasks", newTasks, { shouldValidate: true });
  };

  const addTask = () => {
    const updated = [
      ...tasks,
      {
        task_name: "",
        task_order: tasks.length + 1,
        project_start: "",
        project_end: "",
      },
    ];
    setTasks(updated);
    setValue("project_tasks", updated, { shouldValidate: true });
  };

  const removeTask = (index: number) => {
    const updated = tasks
      .filter((_, i) => i !== index)
      .map((t, i) => ({ ...t, task_order: i + 1 }));
    const final = updated.length
      ? updated
      : [{ task_name: "", task_order: 1, project_start: "", project_end: "" }];
    setTasks(final);
    setValue("project_tasks", final, { shouldValidate: true });
  };

  const handleNextStep1 = async () => {
    const fields: any[] = [
      "title",
      "job_category",
      "description",
      "type",
      "worker_needed",
      "deadline",
    ];
    if (jobType === "PROJECT") fields.push("project_tasks");
    if (jobType === "SHIFT") fields.push("shifts");
    const valid = await trigger(fields);
    if (valid) setStep(2);
  };

  const handleNextStep2 = async () => {
    const valid = await trigger([
      "minimum_education",
      "qualification_description",
      "skills",
    ]);
    if (valid) setStep(3);
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    // Ambil token dari localStorage
    const token = localStorage.getItem("accessToken");

    const body: any = {
      title: watch("title"),
      job_category: watch("job_category"),
      description: watch("description"),
      type: watch("type"),
      salary_min: watch("salary_min") ?? null,
      salary_max: watch("salary_max") ?? null,
      worker_needed: watch("worker_needed"),
      minimum_education: watch("minimum_education"),
      qualification_description: watch("qualification_description"),
      portfolio_requirement: portfolio,
      deadline: watch("deadline"),
      skills,
    };

    if (jobType === "SHIFT") body.shifts = selectedShifts;
    if (jobType === "PROJECT") body.project_tasks = tasks;

    const res = await apiRequest<{ job_id: number }>("/jobs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    setIsSubmitting(false);

    if (res.success) {
      navigate("/umkm/lowongan");
    } else {
      setSubmitError(res.message || "Gagal mempublikasikan lowongan.");
    }
  };

  // ─── STEP 1 ────────────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Informasi Dasar Lowongan
        </h3>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              {...register("title")}
              label="Judul Lowongan"
              placeholder="Judul lowongan pekerjaan"
              error={errors.title?.message}
            />
            <InputField
              {...register("job_category")}
              label="Bidang Pekerjaan"
              placeholder="Contoh: Keuangan, Desain, Marketing"
              error={errors.job_category?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Deskripsi Pekerjaan
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Jelaskan tugas, tanggung jawab, dan aktivitas utama pekerjaan ini"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Jenis Lowongan */}
          <div>
            <label className="text-[14px] font-bold text-gray-800 mb-3 block">
              Jenis Lowongan
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "PROJECT",
                  title: "Berbasis Proyek",
                  desc: "Lowongan berbasis proyek berisi tugas-tugas yang akan dilacak melalui fitur task track.",
                },
                {
                  value: "SHIFT",
                  title: "Pekerja Harian (Shift)",
                  desc: "Digunakan untuk pekerjaan non-proyek seperti koki, kasir, barista.",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-colors ${jobType === opt.value ? "border-[#3B82F6] bg-blue-50/20" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register("type")}
                    className="w-4 h-4 mt-0.5 text-[#3B82F6]"
                  />
                  <div>
                    <h4 className="font-bold text-[13px] text-gray-900 mb-1">
                      {opt.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* SHIFT: pilih jam kerja */}
            {jobType === "SHIFT" && (
              <div className="mt-4">
                <label className="text-[14px] font-bold text-gray-800 mb-2 block">
                  Jam Kerja
                </label>
                <div className="flex gap-3">
                  {(["PAGI", "SIANG", "MALAM"] as const).map((jam) => (
                    <button
                      key={jam}
                      value={jam}
                      type="button"
                      onClick={() => toggleShift(jam)}
                      className={`px-5 py-2 rounded-lg text-xs font-bold border transition-colors ${selectedShifts.includes(jam) ? "bg-[#E6F4F1] border-[#99F6E4] text-[#0F766E]" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {jam}
                    </button>
                  ))}
                </div>
                {errors.shifts && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.shifts.message}
                  </span>
                )}
              </div>
            )}

            {/* PROJECT: milestone */}
            {jobType === "PROJECT" && (
              <div className="mt-4">
                <label className="text-[14px] font-bold text-gray-800 mb-2 block">
                  Milestone / Tugas
                </label>
                <div className="flex flex-col gap-3">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex flex-col border border-gray-200 px-4 py-3 rounded-lg bg-white gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold bg-[#0F766E] w-6 h-6 flex items-center justify-center text-white rounded-full shrink-0">
                          {index + 1}
                        </span>
                        <input
                          value={task.task_name}
                          onChange={(e) =>
                            handleTaskChange(index, "task_name", e.target.value)
                          }
                          placeholder="Nama tugas"
                          className="flex-1 border border-neutral-300 px-3 py-2 rounded-md text-sm focus:outline-none placeholder:text-gray-400"
                        />
                        {errors.project_tasks?.[index]?.task_name && (
                          <p className="text-red-500 text-xs whitespace-nowrap ml-2">
                            {errors.project_tasks[index]?.task_name?.message}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pl-9">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-gray-500">
                            Tanggal Mulai
                          </label>
                          <input
                            type="date"
                            value={task.project_start}
                            onChange={(e) =>
                              handleTaskChange(
                                index,
                                "project_start",
                                e.target.value,
                              )
                            }
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-gray-500">
                            Tanggal Berakhir
                          </label>
                          <input
                            type="date"
                            value={task.project_end}
                            onChange={(e) =>
                              handleTaskChange(
                                index,
                                "project_end",
                                e.target.value,
                              )
                            }
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTask}
                    className="w-max bg-white border border-[#99F6E4] text-[#0F766E] rounded-lg mt-1 hover:bg-[#E6F4F1] font-bold text-xs"
                  >
                    <FiPlus className="mr-1" /> Tambah Tugas
                  </Button>
                  {errors.project_tasks && (
                    <span className="text-red-500 text-xs">
                      {errors.project_tasks.message}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Upah */}
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Informasi Upah
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            type="text"
            label="Upah Minimum (Rp)"
            placeholder="Contoh: 1.500.000"
            value={salaryMinDisplay}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const f = formatRupiah(e.target.value);
              setSalaryMinDisplay(f);
              setValue("salary_min", Number(parseRupiah(f)), {
                shouldValidate: true,
              });
            }}
            error={errors.salary_min?.message}
          />
          <InputField
            type="text"
            label="Upah Maksimum (Rp)"
            placeholder="Contoh: 4.000.000"
            value={salaryMaxDisplay}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const f = formatRupiah(e.target.value);
              setSalaryMaxDisplay(f);
              setValue("salary_max", Number(parseRupiah(f)), {
                shouldValidate: true,
              });
            }}
            error={errors.salary_max?.message}
          />
        </div>
      </Card>

      {/* Jumlah & Deadline */}
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Jumlah Pekerja & Deadline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Jumlah Lowongan
            </label>
            <input
              {...register("worker_needed", { valueAsNumber: true })}
              type="number"
              placeholder="Jumlah pekerja yang dibutuhkan"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
            />
            {errors.worker_needed && (
              <span className="text-red-500 text-sm mt-1">
                {errors.worker_needed.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Batas Waktu Melamar
            </label>
            <input
              {...register("deadline", { valueAsDate: true })}
              type="date"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            />
            {errors.deadline && (
              <span className="text-red-500 text-xs">
                {errors.deadline.message}
              </span>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-2">
        <Button
          type="button"
          onClick={handleNextStep1}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-2.5 rounded-lg font-bold"
        >
          Lanjut <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );

  // ─── STEP 2 ────────────────────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Kualifikasi
        </h3>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Pendidikan Minimum
            </label>
            <input
              {...register("minimum_education")}
              type="text"
              placeholder="Contoh: SMA, D3, S1"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
            />
            {errors.minimum_education && (
              <span className="text-red-500 text-xs">
                {errors.minimum_education.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Kualifikasi Lowongan
            </label>
            <input
              {...register("qualification_description")}
              type="text"
              placeholder="Kriteria kandidat yang dibutuhkan"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
            />
            {errors.qualification_description && (
              <span className="text-red-500 text-xs">
                {errors.qualification_description.message}
              </span>
            )}
          </div>

          {/* Keahlian */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Keahlian Spesifik
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#E6F4F1] text-[#0F766E] px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-[#99F6E4]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </span>
              ))}
              {showSkillInput ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                      if (e.key === "Escape") {
                        setShowSkillInput(false);
                        setSkillInput("");
                      }
                    }}
                    placeholder="Nama keahlian..."
                    className="border border-[#99F6E4] rounded-full px-3 py-1.5 text-[11px] focus:outline-none w-36"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="text-[#0F766E] text-[11px] font-bold"
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSkillInput(false);
                      setSkillInput("");
                    }}
                    className="text-gray-400 text-[11px]"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => setShowSkillInput(true)}
                  className="bg-white text-gray-500 px-4 py-1.5 rounded-full text-[11px] font-semibold border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50"
                >
                  + Keahlian
                </span>
              )}
            </div>
            {errors.skills && (
              <span className="text-red-500 text-xs">
                {errors.skills.message}
              </span>
            )}
          </div>

          {/* Portofolio */}
          <div>
            <label className="text-[14px] font-bold text-gray-800 mb-3 block">
              Persyaratan Portofolio
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "REQUIRED" as const,
                  title: "Wajib melampirkan portofolio",
                  desc: "Pelamar wajib melampirkan portofolio sesuai bidang yang dilamar",
                },
                {
                  value: "OPTIONAL" as const,
                  title: "Opsional",
                  desc: "Portofolio tidak wajib, bisa dilihat dari CV saja.",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-colors ${portfolio === opt.value ? "border-[#3B82F6] bg-blue-50/20" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    checked={portfolio === opt.value}
                    onChange={() => {
                      setPortfolio(opt.value);
                      setValue("portfolio_requirement", opt.value);
                    }}
                    className="w-4 h-4 mt-0.5"
                  />
                  <div>
                    <h4 className="font-bold text-[13px] text-gray-900 mb-1">
                      {opt.title}
                    </h4>
                    <p className="text-[11px] text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between mt-2">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="px-8 py-2.5 rounded-lg font-bold text-gray-600 border-gray-300 bg-white"
        >
          <FiArrowLeft className="mr-2" /> Kembali
        </Button>
        <Button
          type="button"
          onClick={handleNextStep2}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-2.5 rounded-lg font-bold"
        >
          Lanjut <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );

  // ─── STEP 3 ────────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-12 text-center min-h-[350px] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
          Siap Dipublikasi!
        </h3>
        <p className="text-gray-500 mb-6 max-w-md text-sm leading-relaxed">
          Semua data lowongan telah lengkap. Pastikan informasi sudah benar
          sebelum dipublikasikan.
        </p>
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs w-full max-w-md">
            {submitError}
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-2">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          className="px-8 py-2.5 rounded-lg font-bold text-gray-600 border-gray-300 bg-white"
        >
          <FiArrowLeft className="mr-2" /> Kembali
        </Button>
        <Button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="bg-[#0F766E] hover:bg-[#0D645E] text-white px-10 py-2.5 rounded-lg font-bold"
        >
          {isSubmitting ? "Memproses..." : "Publikasikan"}{" "}
          {!isSubmitting && <FiArrowRight className="ml-2" />}
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardUmkmLayout>
      <div className="w-full min-h-screen bg-[#F8FAFC] pt-[60px]">
        <div className="bg-[#E2E8F0] pt-10 pb-20 px-4 md:px-8">
          <div className="container mx-auto max-w-5xl">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-[#1E293B] hover:text-black font-extrabold text-xl mb-2"
            >
              <FiArrowLeft strokeWidth={3} /> Buka Lowongan
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-5xl -mt-12 pb-24 relative z-10">
          {/* Stepper */}
          <div className="w-full bg-white rounded-[14px] shadow-sm border border-gray-100 p-4 md:px-8 md:py-5 mb-8 flex justify-between items-center relative">
            <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gray-100 -z-10 -translate-y-1/2 hidden md:block" />
            {steps.map((s) => (
              <div
                key={s.id}
                className="flex flex-col md:flex-row items-center gap-3 bg-white px-1 md:px-4 z-10"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${step >= s.id ? "bg-[#2DD4BF] text-white" : "bg-white border-2 border-gray-200 text-gray-400"}`}
                >
                  {s.id}
                </div>
                <span
                  className={`text-[13px] font-bold hidden sm:block ${step >= s.id ? "text-[#1E293B]" : "text-gray-400"}`}
                >
                  {s.name}
                </span>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
        </div>
      </div>
    </DashboardUmkmLayout>
  );
}
