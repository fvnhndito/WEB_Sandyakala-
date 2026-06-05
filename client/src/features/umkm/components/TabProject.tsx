import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "react-router-dom";
// import { FaPlus } from "react-icons/fa6";
import { Card } from "./ui/Card";
import TitleCard from "./ui/TitleCard";
import ImgEmptyData from "@/assets/images/Img Empty Data - Tab Project.png";
import { EmptyData } from "./ui/EmptyData";
import { apiRequest } from "@/shared/lib/api";

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

interface TaskRow extends ProjectTask {
  job_title: string;
  worker_names: string[];
}

type StatusVariantType = "info" | "warning" | "error" | "success";

const statusVariantMap: Record<string, StatusVariantType> = {
  // DRAFT: "info",
  REVIEW: "warning",
  REVISI: "error",
  SELESAI: "success",
  PENDING: "info",
};

export default function TabProject() {
  const [taskRows, setTaskRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Silakan login kembali.");
        return;
      }

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
        setError(listRes.message || "Gagal memuat data project.");
        return;
      }

      const acceptedByJobId: Record<number, string[]> = {};

      if (appsRes.success && appsRes.data) {
        const apps = Array.isArray(appsRes.data)
          ? appsRes.data
          : ((appsRes.data as any).applicants ?? []);

        apps
          .filter((a: any) => a.status === "ACCEPTED")
          .forEach((a: any) => {
            const jid = Number(a.job_id);

            if (!a.applicant_name) return;

            acceptedByJobId[jid] = [
              ...(acceptedByJobId[jid] || []),
              a.applicant_name,
            ];

            acceptedByJobId[jid] = [...new Set(acceptedByJobId[jid])];
          });
      }

      const projectJobs = (listRes.data as any[]).filter(
        (j: any) => j.type === "PROJECT",
      );

      const details = await Promise.all(
        projectJobs.map((job: any) =>
          apiRequest<any>(`/jobs/${job.id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      const rows: TaskRow[] = [];

      details.forEach((res) => {
        if (!res.success || !res.data) return;

        const job = res.data;
        const workerNames = acceptedByJobId[job.id] ?? [];

        (job.project_tasks ?? []).forEach((task: ProjectTask) => {
          rows.push({
            ...task,
            job_title: job.title,
            worker_names: workerNames,
          });
        });
      });

      setTaskRows(rows);
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat memuat data project.");
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = ["Semua", "Review", "Revisi", "Selesai"];

  const filteredTasks = useMemo(() => {
    if (activeFilter === "Semua") return taskRows;

    return taskRows.filter(
      (task) => task.status?.toUpperCase() === activeFilter.toUpperCase(),
    );
  }, [taskRows, activeFilter]);

  const recentProjects = [...taskRows]
    .sort(
      (a, b) =>
        new Date(b.project_start).getTime() -
        new Date(a.project_start).getTime(),
    )
    .slice(0, 3);

  if (loading) {
    return (
      <section className="container pb-10">
        <p className="text-center py-10 text-neutral-500">Memuat data...</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="container pb-10">
        <p className="text-center py-10 text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="container pb-10">
      <div className="flex gap-2 mb-8">
        {/* <Link
          to="/umkm/dashboard/addproject"
          className="flex items-center gap-2 px-4 py-2.5 border hover:bg-mint-200 transition-all duration-100 hover:text-white cursor-pointer border-mint text-mint bg-mint-200/50 text-sm rounded-md"
        >
          <FaPlus className="text-xl" /> Tambah Project
        </Link> */}
        <Link
          to="/umkm/dashboard/data-project"
          className="px-4 text-mint py-2.5 border hover:bg-mint-200/50 border-mint cursor-pointer text-sm rounded-md"
        >
          Lihat Data Project
        </Link>
      </div>

      {taskRows.length === 0 ? (
        <EmptyData
          title="Belum Ada Proyek"
          description="Tambahkan lowongan baru berbasis proyek untuk mulai mengelola pekerjaan tim kamu."
          // actionLabel="Tambah Project"
          // actionTo="/umkm/dashboard/addproject"
          image={ImgEmptyData}
        />
      ) : (
        <>
          {/* Proyek Terbaru */}
          <TitleCard
            title="Proyek Terbaru"
            link="/umkm/dashboard/data-project"
          />
          <Card className="mb-10">
            {recentProjects.map((item) => (
              <div
                key={`${item.job_id}-${item.id}`}
                className="rounded-md shadow-md px-6 pt-3.5 pb-3 mb-3 bg-neutral-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{item.job_title}</h3>
                    <p className="text-xs text-gray-400">
                      {item.task_name} &mdash; deadline{" "}
                      {new Date(item.project_end).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      statusVariantMap[item.status?.toUpperCase()] ?? "info"
                    }
                    size={"sm"}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </Card>

          {/* Task Aktif */}
          <TitleCard
            title="Task Aktif"
            link="/umkm/dashboard/data-project"
            className="mb-3"
          />
          <Card>
            <div className="flex gap-3 mb-6 flex-wrap">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  className={`px-4 py-2 text-sm rounded-full border border-mint transition-all ${
                    activeFilter === opt
                      ? "bg-mint text-white"
                      : "text-mint hover:bg-mint-200/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <p className="text-center py-5 text-neutral-500 text-sm">
                  Tidak ada task dengan status ini.
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={`${task.job_id}-${task.id}-${task.task_order}`}
                    className="pb-3 border-b"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <h3 className="font-medium text-lg">
                          {task.task_name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {task.worker_names.length > 0
                            ? task.worker_names.join(", ")
                            : "Belum ada anggota"}{" "}
                          &mdash; {task.job_title}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <Badge
                          variant={"error"}
                          size={"sm"}
                          className="py-2 px-5 bg-white"
                        >
                          {new Date(task.project_end).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </Badge>
                        <Badge
                          variant={
                            statusVariantMap[task.status?.toUpperCase()] ??
                            "info"
                          }
                          size={"sm"}
                          className="py-2 px-5"
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </section>
  );
}
