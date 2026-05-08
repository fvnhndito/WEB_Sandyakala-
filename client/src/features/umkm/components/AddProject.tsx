import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← hapus useOutletContext di sini
import TaskLayout from "@/shared/layouts/TaskLayout";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { GoX, GoPlus } from "react-icons/go";
import SectionTask from "@/features/umkm/components/ui/section-task";
import type { Project } from "@/features/umkm/types/dashboard.types";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type AddProjectProps = {
  projects: any[];
  setProjects: React.Dispatch<React.SetStateAction<any[]>>;
};

interface IFormInput {
  namaProject: string;
  divisiProject: string;
  deskripsiProject: string;
  tanggalMulaiProject: string;
  tanggalSelesaiProject: string;
  anggotaTimProject: string;
  penanggungJawabProject: string;
}

export default function AddProject({ projects, setProjects }: AddProjectProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const navigate = useNavigate();

  const [project, setProject] = useState({
    id: "",
    nama_project: "",
    divisi_project: "",
    deskripsi_project: "",
    tanggal_mulai_project: "",
    tanggal_selesai_project: "",
    list_tugas_project: [""],
    anggota_tim_project: "",
    penanggung_jawab_project: "",
    status_project: "",
  });

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...project.list_tugas_project];
    newTasks[index] = value;
    setProject((prev) => ({ ...prev, list_tugas_project: newTasks }));
  };

  const addTaskProject = () => {
    setProject((prev) => ({
      ...prev,
      list_tugas_project: [...prev.list_tugas_project, ""],
    }));
  };

  const removeTask = (index: number) => {
    const newTasks = project.list_tugas_project.filter((_, i) => i !== index);
    setProject((prev) => ({
      ...prev,
      list_tugas_project: newTasks.length ? newTasks : [""],
    }));
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const filteredTasksProject = project.list_tugas_project.filter(
      (t) => t.trim() !== "",
    );

    const newProject: Project = {
      ...project,
      id: String(projects.length + 1),
      nama_project: data.namaProject,
      divisi_project: data.divisiProject,
      deskripsi_project: data.deskripsiProject,
      tanggal_mulai_project: data.tanggalMulaiProject,
      tanggal_selesai_project: data.tanggalSelesaiProject,
      anggota_tim_project: data.anggotaTimProject,
      penanggung_jawab_project: data.penanggungJawabProject,
      list_tugas_project: filteredTasksProject,
      status_project: "Review" as "Selesai" | "Revisi" | "Review",
    };

    setProjects((prev) => [...prev, newProject]);
    navigate("/umkm/dashboard/data-project");
  };

  return (
    <TaskLayout type="project" onSubmit={handleSubmit(onSubmit)}>
      <SectionTask title="Detail Project">
        <label className="flex flex-col">
          <span className="text-sm">Nama Project</span>
          <Input
            placeholder="Nama project"
            className="rounded-lg mt-2 mb-2"
            {...register("namaProject", {
              required: "Nama project wajib diisi",
            })}
          />
          {errors.namaProject && (
            <span className="text-error text-xs">
              {errors.namaProject.message}
            </span>
          )}
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Divisi Project</span>
          <Input
            placeholder="Design / Development / QA"
            className="rounded-lg mt-2 "
            {...register("divisiProject", {
              required: "Divisi project wajib diisi",
            })}
          />
          {errors.divisiProject && (
            <span className="text-error text-xs mt-1">
              {errors.divisiProject.message}
            </span>
          )}
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-2">Deskripsi Project</span>
          <textarea
            placeholder="Deskripsi project"
            className="w-full px-6 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-primary"
            {...register("deskripsiProject", {
              required: "Deskripsi project wajib diisi",
            })}
          />
          {errors.deskripsiProject && (
            <span className="text-error text-xs mt-1">
              {errors.deskripsiProject.message}
            </span>
          )}
        </label>

        <div className="flex gap-3 mt-3">
          <div className="w-full">
            <span className="text-sm">Tanggal Mulai</span>
            <Input
              type="date"
              className="mt-2 rounded-lg"
              {...register("tanggalMulaiProject", {
                required: "Tanggal mulai wajib diisi",
              })}
            />
            {errors.tanggalMulaiProject && (
              <span className="text-error text-xs mt-1">
                {errors.tanggalMulaiProject.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <span className="text-sm">Tanggal Selesai</span>
            <Input
              type="date"
              className="mt-2 rounded-lg"
              {...register("tanggalSelesaiProject", {
                required: "Tanggal selesai wajib diisi",
                validate: (value, formValues) =>
                  value >= formValues.tanggalSelesaiProject ||
                  "Tanggal selesai tidak boleh sebelum tanggal mulai",
              })}
            />
            {errors.tanggalSelesaiProject && (
              <span className="text-error text-xs mt-1">
                {errors.tanggalSelesaiProject.message}
              </span>
            )}
          </div>
        </div>
      </SectionTask>

      <SectionTask title="Milestone">
        <ol>
          {project.list_tugas_project.map((task, index) => (
            <li
              key={index}
              className="flex flex-row items-center border border-neutral-500 px-7 py-3 mt-2 rounded-md"
            >
              <span className="mr-5 font-bold bg-primary-dark px-3 py-1 text-white rounded-full">
                {index + 1}
              </span>

              <Input
                value={task}
                onChange={(e) => handleTaskChange(index, e.target.value)}
                placeholder="Tugas project"
                className="rounded-lg"
              />

              <GoX
                className="ml-3 cursor-pointer"
                onClick={() => removeTask(index)}
              />
            </li>
          ))}

          <Button
            type="button"
            onClick={addTaskProject}
            className="bg-white border border-teal-300 text-teal-300 rounded-lg mt-5 hover:bg-teal-100 font-semibold"
          >
            <GoPlus className="mr-2" /> Tambah Tugas
          </Button>
        </ol>
      </SectionTask>

      <SectionTask title="Tim">
        <label className="flex flex-col">
          <span className="text-sm">Tambahkan Anggota Tim</span>
        <Input
          placeholder="Anggota tim"
          className=" rounded-lg mt-2"
          {...register("anggotaTimProject", {
            required: "Anggota tim wajib diisi",
          })}
        />
        {errors.anggotaTimProject && (
          <span className="text-error text-xs mt-1">
            {errors.anggotaTimProject.message}
          </span>
        )}
        </label>
        

        <label className="flex flex-col">
          <span className="text-sm">Penanggung Jawab Tim</span>

          <Input
            placeholder="Penanggung jawab"
            className="rounded-lg mt-2"
            {...register("penanggungJawabProject", {
              required: "Penanggung jawab wajib diisi",
            })}
          />
          {errors.penanggungJawabProject && (
            <span className="text-error text-xs mt-1">
              {errors.penanggungJawabProject.message}
            </span>
          )}
        </label>
      </SectionTask>
    </TaskLayout>
  );
}
