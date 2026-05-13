import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import type { Project } from "@/features/umkm/types/dashboard.types";
import RevisiTugas from "@/features/umkm/components/RevisiTugas";
import { useState } from "react";
import { useTask } from "@/pages/umkm/TaskContext";


export default function DataProject() {
  const { projects } = useTask();
  const showDetailButtonProject = ["Review", "Revisi", "Selesai"];
  const [showRevisi, setShowRevisi] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (showRevisi && selectedProject) {
    return (
      <RevisiTugas
        project={selectedProject}
        onBack={() => setShowRevisi(false)}
      />
    );
  }
  // Atur status project
  const getStatusBadgeProject = (status_project: Project["status_project"]) => {
    const classesProject: Record<string, string> = {
      revisi: "bg-error-100 text-error",
      review: "bg-warning-200/50 text-warning-300",
      selesai: "bg-primary/50 text-primary-dark",
    };
    return classesProject[status_project.toLowerCase()] ?? "";
  };

  const filteredProjects = projects.filter((p) =>
  searchQuery
    ? p.nama_project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.anggota_tim_project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.divisi_project.toLowerCase().includes(searchQuery.toLowerCase())
    : true
);

  return (
    <DataTaskLayout
      title="Data Tugas Pekerja"
      description="Kelola semua tugas pekerja dalam satu tampilan"
      activeTab="dataProject"
      onSearch={(query) => setSearchQuery(query)}
      tabs={[
        {
          label: "Proyek Masuk",
          path: "/umkm/dashboard/data-project",
          key: "dataProject",
        },
        {
          label: "Shift Harian",
          path: "/umkm/dashboard/data-shift",
          key: "dataShift",
        },
      ]}
      statusOptions={["Review", "Revisi", "Selesai"]}
    >
      <div className="w-full px-2 sm:px-6">
        <div className="border border-neutral-200 rounded-lg overflow-x-auto">
          <table className="min-w-fit w-full table-auto border-collapse text-sm text-neutral-900">
            <thead>
              <tr className="bg-mint/15 text-center">
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs">No</th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                  Nama Proyek
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                  PJ Proyek
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                  Tanggal Proyek
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                  Deadline Proyek
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs">Status</th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <tr
                    key={project.id ?? index}
                    className="hover:bg-neutral-100 transition text-center text-xs"
                  >
                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">{index + 1}</td>

                    <td className="border px-5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {project.nama_project}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {project.divisi_project} -{" "}
                          {project.anggota_tim_project}
                        </span>
                      </div>
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs truncate">
                      {project.penanggung_jawab_project}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs capitalize">
                      {new Date(
                        project.tanggal_mulai_project,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                      {new Date(
                        project.tanggal_selesai_project,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadgeProject(
                          project.status_project,
                        )}`}
                      >
                        {project.status_project}
                      </span>
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">
                      {showDetailButtonProject.includes(
                        project.status_project,
                      ) && (
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowRevisi(true);
                          }}
                          className="border border-primary-dark px-3 py-1 text-xs rounded-md hover:bg-primary-dark hover:text-white transition cursor-pointer"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-5 text-neutral-500"
                  >
                    Tidak ada data proyek
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DataTaskLayout>
  );
}
