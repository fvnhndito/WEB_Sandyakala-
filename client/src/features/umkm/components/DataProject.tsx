import { useState, useEffect } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { apiRequest } from "@/shared/lib/api";
import RevisiTugas from "@/features/umkm/components/RevisiTugas";
import { ModalDetailProject } from "@/shared/components/ui/modal-project";

interface ProjectTask {
  id: number;
  job_id: number;
  task_name: string;
  task_order: number;
  project_start: string;
  project_end: string;
  status: string;
  submission_link?: string;
  revision_note?: string;
}

interface JobWithTasks {
  id: number;
  title: string;
  type: string;
  worker_needed: number;
  business_name: string;
  project_tasks?: ProjectTask[];
}

interface TaskRow extends ProjectTask {
  job_title: string;
  worker_needed: number;
  worker_names: string[];
}

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    REVIEW: "bg-warning-200/50 text-warning-300",
    REVISI: "bg-error-100 text-error",
    SELESAI: "bg-primary/50 text-primary-dark",
    PENDING: "bg-neutral-200 text-neutral-600",
  };
  return map[status?.toUpperCase()] ?? "bg-neutral-200 text-neutral-600";
};

export default function DataProject() {
  const [taskRows, setTaskRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRevisi, setShowRevisi] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [modalDetailProject, setModalDetailProject] = useState<TaskRow | null>(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    // Fetch jobs & applications sekaligus
    const [listRes, appsRes] = await Promise.all([
      apiRequest<any>("/jobs/umkm/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      apiRequest<any>("/applications/umkm", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!listRes.success || !listRes.data) {
      setError(listRes.message || "Gagal mengambil data lowongan");
      setLoading(false);
      return;
    }

    // Group nama pekerja ACCEPTED per job_id
    const acceptedByJobId: Record<number, string[]> = {};
    if (appsRes.success && appsRes.data) {
      const apps = Array.isArray(appsRes.data)
        ? appsRes.data
        : (appsRes.data as any).applicants ?? [];

      apps
        .filter((a: any) => a.status === "ACCEPTED")
        .forEach((a: any) => {
          const jid = Number(a.job_id);
          if (!acceptedByJobId[jid]) acceptedByJobId[jid] = [];
          if (a.applicant_name) acceptedByJobId[jid].push(a.applicant_name);
        });
    }

    // Filter hanya PROJECT
    const projectJobs: JobWithTasks[] = (listRes.data as any[]).filter(
      (j: any) => j.type === "PROJECT"
    );

    // Fetch detail tiap job
    const details = await Promise.all(
      projectJobs.map((job) =>
        apiRequest<JobWithTasks>(`/jobs/${job.id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );

    // Flatten tasks
    const rows: TaskRow[] = [];
    details.forEach((res) => {
      if (!res.success || !res.data) return;
      const job = res.data;
      const workerNames = acceptedByJobId[job.id] ?? [];

      (job.project_tasks ?? []).forEach((task) => {
        rows.push({
          ...task,
          job_title: job.title,
          worker_needed: job.worker_needed,
          worker_names: workerNames,
        });
      });
    });

    setTaskRows(rows);
    setLoading(false);
  };

  const filtered = taskRows.filter((row) =>
    searchQuery
      ? row.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.task_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  if (showRevisi && selectedTask) {
    return (
      <RevisiTugas
        task={selectedTask}
        onBack={() => {
          setShowRevisi(false);
          setSelectedTask(null);
          fetchData();
        }}
      />
    );
  }

  return (
    <>
      <DataTaskLayout
        title="Data Tugas Pekerja"
        description="Kelola semua tugas pekerja dalam satu tampilan"
        activeTab="dataProject"
        onSearch={setSearchQuery}
        tabs={[
          { label: "Proyek Masuk", path: "/umkm/dashboard/data-project", key: "dataProject" },
          { label: "Shift Harian", path: "/umkm/dashboard/data-shift", key: "dataShift" },
        ]}
        statusOptions={["Review", "Revisi", "Selesai"]}
      >
        <div className="w-full px-2 sm:px-6">
          {loading ? (
            <p className="text-center py-10 text-neutral-500">Memuat data...</p>
          ) : error ? (
            <p className="text-center py-10 text-red-500">{error}</p>
          ) : (
            <div className="border border-neutral-200 rounded-lg overflow-x-auto">
              <table className="min-w-fit w-full table-auto border-collapse text-sm text-neutral-900">
                <thead>
                  <tr className="bg-mint/15 text-center">
                    <th className="border px-3 py-2 text-xs">No</th>
                    <th className="border px-3 py-2 text-xs whitespace-nowrap">Nama Proyek</th>
                    <th className="border px-3 py-2 text-xs whitespace-nowrap">Nama Tugas</th>
                    <th className="border px-3 py-2 text-xs whitespace-nowrap">Anggota Proyek</th>
                    <th className="border px-3 py-2 text-xs whitespace-nowrap">Mulai Proyek</th>
                    <th className="border px-3 py-2 text-xs whitespace-nowrap">Deadline Proyek</th>
                    <th className="border px-3 py-2 text-xs">Status</th>
                    <th className="border px-3 py-2 text-xs">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((row, index) => (
                      <tr key={row.id} className="hover:bg-neutral-100 transition text-center text-xs">
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="border px-3 py-2">{row.job_title}</td>
                        <td className="border px-3 py-2">{row.task_name}</td>
                        <td className="border px-3 py-2">
                          {row.worker_names.length > 0 ? (
                            <div className="flex flex-col gap-0.5 items-center">
                              {row.worker_names.map((name, i) => (
                                <span key={i} className="text-xs">{name}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-xs italic">Belum ada</span>
                          )}
                        </td>
                        <td className="border px-3 py-2">
                          {new Date(row.project_start).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </td>
                        <td className="border px-3 py-2 whitespace-nowrap">
                          {new Date(row.project_end).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </td>
                        <td className="border px-3 py-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadge(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="border px-3 py-2">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => setModalDetailProject({
                                id: String(row.id),
                                nama_project: row.job_title,
                                divisi_project: row.task_name,
                                deskripsi_project: `Tugas ke-${row.task_order}`,
                                tanggal_mulai_project: row.project_start,
                                tanggal_selesai_project: row.project_end,
                                status_project: row.status as any,
                                anggota_tim_project: row.worker_names.length > 0
                                  ? row.worker_names.join(", ")
                                  : "Belum ada anggota",
                                penanggung_jawab_project: row.worker_names[0] ?? "-",
                                list_tugas_project: [],
                              } as any)}
                              className="border border-primary-dark px-3 py-1 text-xs rounded-md hover:bg-primary-dark hover:text-white transition cursor-pointer"
                            >
                              Detail
                            </button>
                            {["REVIEW", "REVISI"].includes(row.status?.toUpperCase()) && (
                              <button
                                onClick={() => { setSelectedTask(row); setShowRevisi(true); }}
                                className="border border-warning-300 px-3 py-1 text-xs rounded-md hover:bg-warning-200 transition cursor-pointer whitespace-nowrap"
                              >
                                Tinjau
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-5 text-neutral-500">
                        Tidak ada data proyek
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DataTaskLayout>
      <ModalDetailProject
        open={!!modalDetailProject}
        onClose={() => setModalDetailProject(null)}
        project={modalDetailProject as any}
      />
    </>
  );
}
