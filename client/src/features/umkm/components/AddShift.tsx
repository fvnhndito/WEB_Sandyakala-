import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskLayout from "@/shared/layouts/TaskLayout";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { GoX } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import SectionTask from "@/features/umkm/components/ui/section-task";
import type { Shift } from "@/features/umkm/types/dashboard.types";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";


interface AddShiftProps {
  type: "pagi" | "siang" | "malam";
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
}

interface IFormInput {
  divisiShift: string;
  namaPekerjaShift: string;
  namaShift: string;
  tanggalShift: string;
  waktuMulaiShift: string;
  waktuSelesaiShift: string;
  jenisShift: "pagi" | "siang" | "malam";
}

export default function AddShift({ type, shifts, setShifts }: AddShiftProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      jenisShift: type,
    },
  });

  const [activeType, setActiveType] = useState<"pagi" | "siang" | "malam">(
    type,
  );

  const [shift, setShift] = useState<Shift>({
    id: 1,
    divisi_shift: "",
    nama_pekerja_shift: "",
    nama_shift: "",
    tanggal_shift: "",
    waktu_mulai_shift: "",
    waktu_selesai_shift: "",
    jenis_shift: type,
    list_tugas_shift: [""],
    status_shift: "Proses",
    jam_masuk: "",
    jam_pulang: "",
  });

  const navigate = useNavigate();


  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...shift.list_tugas_shift];
    newTasks[index] = value;
    setShift((prev) => ({ ...prev, list_tugas_shift: newTasks }));
  };

  const addTaskShift = () => {
    setShift((prev) => ({
      ...prev,
      list_tugas_shift: [...prev.list_tugas_shift, ""],
    }));
  };

  const removeTask = (index: number) => {
    if (shift.list_tugas_shift.length === 1) return;
    const newTasks = shift.list_tugas_shift.filter((_, i) => i !== index);
    setShift((prev) => ({ ...prev, list_tugas_shift: newTasks }));
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const filteredTasksShift = shift.list_tugas_shift.filter(
      (t) => t.trim() !== "",
    );

      const newShift: Shift = {
        ...shift,
        id: shifts.length + 1,
        divisi_shift: data.divisiShift,
        nama_pekerja_shift: data.namaPekerjaShift,
        nama_shift: data.namaShift,
        tanggal_shift: data.tanggalShift,
        waktu_mulai_shift: data.waktuMulaiShift,
        waktu_selesai_shift: data.waktuSelesaiShift,
        jenis_shift: data.jenisShift,
        list_tugas_shift: filteredTasksShift,
        status_shift: "Proses" as "Disetujui" | "Proses" | "Review",
      };

      setShifts([...shifts, newShift]);
      navigate("/umkm/dashboard/data-shift");
    };

    return (
      <TaskLayout type="shift" onSubmit={handleSubmit(onSubmit)}>
        <SectionTask title="Detail Shift Harian">
          {/* Nama Tugas Shift */}
          <label htmlFor="nama_shift" className="flex flex-col">
            <span className="text-sm leading-base mb-2">Divisi Shift</span>
            <Input
              id="divisiShift"
              placeholder="Developer / QA / UI Designer"
              className="rounded-lg mt-2"
              {...register("divisiShift", {
                required: "Divisi shift wajib diisi",
              })}
            />
            {errors.divisiShift && (
              <span className="text-error text-xs mt-1">
                {errors.divisiShift.message}
              </span>
            )}
          </label>

          {/* Pilih Pekerja */}
          <div className="mt-3">
            <label htmlFor="nama_pekerja_shift" className="flex flex-col">
              <span className="text-sm leading-base">Tambahkan Pekerja</span>
              <Input
                id="namaPekerjaShift"
                placeholder="Tambah pekerja yang ditugaskan pada shift tersebut"
                className="rounded-lg mt-2"
                {...register("namaPekerjaShift", {
                  required: "Nama pekerja wajib diisi",
                })}
              />
              {errors.namaPekerjaShift && (
                <span className="text-error text-xs mt-1">
                  {errors.namaPekerjaShift.message}
                </span>
              )}
            </label>
          </div>

          {/* Tugas Shift Pekerja */}
          <div className="mt-3">
            <label htmlFor="nama_pekerja_shift" className="flex flex-col">
              <span className="text-sm leading-base">Nama Tugas Shift</span>
              <Input
                id="namaShift"
                placeholder="Tugas shift yang akan diberikan kepada pekerja"
                className="rounded-lg mt-2"
                {...register("namaShift", {
                  required: "Nama tugas shift wajib diisi",
                })}
              />
              {errors.namaShift && (
                <span className="text-error text-xs mt-1">
                  {errors.namaShift.message}
                </span>
              )}
            </label>
          </div>

          {/* Tanggal Shift */}
          <div className="mt-3">
            <label htmlFor="tanggal_shift" className="flex flex-col">
              <span className="text-sm leading-base">Tanggal Shift</span>
              <Input
                id="tanggalShift"
                type="date"
                className="rounded-lg mt-2"
                {...register("tanggalShift", {
                  required: "Tanggal shift wajib diisi",
                  validate: (value) => {
                    const today = new Date().toISOString().split("T")[0];
                    return value >= today || "Tanggal tidak boleh di masa lalu";
                  },
                })}
              />
              {errors.tanggalShift && (
                <span className="text-error text-xs mt-1">
                  {errors.tanggalShift.message}
                </span>
              )}
            </label>
          </div>

          {/* Waktu Shift */}
          <div className="flex flex-row justify-between mt-3">
            <div className="flex flex-col w-full pr-3">
              <label htmlFor="waktu_mulai_shift" className="flex flex-col">
                <span className="text-sm leading-base">Waktu Mulai Shift</span>
                <Input
                  id="waktuMulaiShift"
                  type="time"
                  className="rounded-lg mt-2"
                  {...register("waktuMulaiShift", {
                    required: "Waktu mulai wajib diisi",
                  })}
                />
                {errors.waktuMulaiShift && (
                  <span className="text-error text-xs mt-1">
                    {errors.waktuMulaiShift.message}
                  </span>
                )}
              </label>
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="waktu_selesai_shift" className="flex flex-col">
                <span className="text-sm leading-base">
                  Waktu Selesai Shift
                </span>
                <Input
                  id="waktuSelesaiShift"
                  type="time"
                  className="rounded-lg mt-2"
                  {...register("waktuSelesaiShift", {
                    required: "Waktu selesai wajib diisi",
                  })}
                />
                {errors.waktuSelesaiShift && (
                  <span className="text-error text-xs mt-1">
                    {errors.waktuSelesaiShift.message}
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Jenis Shift */}
          <div className="w-fit mt-3">
            <label>
              <span className="text-sm leading-base">Jenis Shift</span>
              <div className="w-fit flex flex-row mt-2 gap-3">
                {(["pagi", "siang", "malam"] as const).map((jenisItem) => (
                  <Button
                    key={jenisItem}
                    type="button"
                    onClick={() => {
                      setActiveType(jenisItem);
                      setShift((prev) => ({ ...prev, jenis_shift: jenisItem }));
                    }}
                    className={`w-fit px-3 border capitalize ${
                      activeType === jenisItem
                        ? "bg-teal-100 border-primary-dark text-primary-dark hover:bg-teal-100 font-semibold"
                        : "bg-white border-neutral-900 text-neutral-900 hover:bg-gray-100"
                    }`}
                  >
                    {jenisItem.charAt(0).toUpperCase() + jenisItem.slice(1)}
                  </Button>
                ))}
              </div>
            </label>
          </div>

          {/* List Tugas Shift */}
          <label htmlFor="" className="flex flex-col mt-3">
            <span className="text-sm leading-base">List Tugas Shift</span>
            <ol>
              {shift.list_tugas_shift.map((taskShift, index) => (
                <li
                  key={index}
                  className="flex flex-row items-center border border-neutral-500 px-7 py-3 mt-2 rounded-md"
                >
                  <span className="mr-5 font-bold bg-primary-dark px-3 py-1 text-white rounded-full">
                    {index + 1}
                  </span>
                  <Input
                    value={taskShift}
                    name="list_tugas_shift"
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder="Ketik tugas yang ingin kamu berikan"
                    className="rounded-lg"
                  />
                  {shift.list_tugas_shift.length > 1 && (
                    <GoX
                      className="text-2xl ml-3 cursor-pointer text-red-400 hover:text-red-600"
                      onClick={() => removeTask(index)}
                    />
                  )}
                </li>
              ))}
              <Button
                type="button"
                onClick={addTaskShift}
                className="bg-white border border-teal-300 text-teal-300 rounded-lg mt-5 hover:bg-teal-100 font-semibold"
              >
                <GoPlus className="text-teal-300 mr-2" /> Tambah Tugas
              </Button>
            </ol>
          </label>
        </SectionTask>
      </TaskLayout>
    );
  }
