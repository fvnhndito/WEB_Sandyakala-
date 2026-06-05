import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { Card } from "./ui/Card";
import TitleCard from "./ui/TitleCard";
import { EmptyData } from "./ui/EmptyData";
// import StatCard from "./ui/StatCard";
import ImgEmptyData from "@/assets/images/Img Empty Data - Tab Shift.png";
import { apiRequest } from "@/shared/lib/api";

interface ShiftRow {
  job_id: number | string;
  job_title: string;
  job_category: string;
  shift_type: string;
  worker_names: string[];
}

interface WorkerShiftItem {
  id: number | string;
  name: string;
  role: string;
  shift_type: string;
  job_title: string;
}

export default function TabShift() {
  const [shiftRows, setShiftRows] = useState<ShiftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShift, setActiveShift] = useState<string>("SEMUA");
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
      setError(listRes.message || "Gagal memuat data shift.");
      return;
    }

    const acceptedByJobId: Record<number, { name: string }[]> = {};

    if (appsRes.success && appsRes.data) {
      const apps = Array.isArray(appsRes.data)
        ? appsRes.data
        : ((appsRes.data as any).applicants ?? []);

      apps
        .filter((a: any) => a.status === "ACCEPTED")
        .forEach((a: any) => {
          const jid = Number(a.job_id);

          if (!acceptedByJobId[jid]) {
            acceptedByJobId[jid] = [];
          }

          if (
            a.applicant_name &&
            !acceptedByJobId[jid].some(
              (w) => w.name === a.applicant_name
            )
          ) {
            acceptedByJobId[jid].push({
              name: a.applicant_name,
            });
          }
        });
    }

    const shiftJobs = (listRes.data as any[]).filter(
      (j: any) => j.type === "SHIFT",
    );

    const details = await Promise.all(
      shiftJobs.map((job: any) =>
        apiRequest<any>(`/jobs/${job.id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    );

    const rows: ShiftRow[] = [];

    details.forEach((res) => {
      if (!res.success || !res.data) return;

      const job = res.data;
      const workers = acceptedByJobId[job.id] ?? [];

      (job.shifts ?? []).forEach((shiftType: string) => {
        rows.push({
          job_id: job.id,
          job_title: job.title,
          job_category: job.job_category ?? "-",
          shift_type: shiftType.trim().toUpperCase(),
          worker_names: workers.map((w) => w.name),
        });
      });
    });

    setShiftRows(rows);
  } catch (error) {
    console.error(error);
    setError("Terjadi kesalahan saat memuat data shift.");
  } finally {
    setLoading(false);
  }
};

  const workerItems: WorkerShiftItem[] = shiftRows.flatMap((row) =>
    row.worker_names.length > 0
      ? row.worker_names.map((name, i) => ({
          id: `${row.job_id}-${row.shift_type}-${i}`,
          name,
          role: row.job_category,
          shift_type: row.shift_type,
          job_title: row.job_title,
        }))
      : [
          {
            id: `${row.job_id}-${row.shift_type}`,
            name: "-",
            role: row.job_category,
            shift_type: row.shift_type,
            job_title: row.job_title,
          },
        ],
  );
  console.log(workerItems);
console.log("WORKER ITEMS", workerItems);

  const filteredItems =
    activeShift === "SEMUA"
      ? workerItems
      : workerItems.filter((i) => i.shift_type === activeShift);

  // StatCard counts dari data asli
  // const totalShift = shiftRows.length;
  // const shiftPagi = shiftRows.filter((r) => r.shift_type === "PAGI").length;
  // const shiftSiang = shiftRows.filter((r) => r.shift_type === "SIANG").length;
  // const shiftMalam = shiftRows.filter((r) => r.shift_type === "MALAM").length;

  // const statCards = [
  //   { title: "Total Shift", value: totalShift, colorClass: "text-primary" },
  //   { title: "Shift Pagi", value: shiftPagi, colorClass: "text-warning" },
  //   { title: "Shift Siang", value: shiftSiang, colorClass: "text-blue-500" },
  //   { title: "Shift Malam", value: shiftMalam, colorClass: "text-indigo-500" },
  // ];

  const shiftTabs = ["SEMUA", "PAGI", "SIANG", "MALAM"];

  const getInitials = (name: string) => {
    if (!name || name === "-") return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const shiftColorMap: Record<string, string> = {
    PAGI: "bg-amber-100 text-amber-700",
    SIANG: "bg-blue-100 text-blue-700",
    MALAM: "bg-indigo-100 text-indigo-700",
  };

  const getShiftColor = (type: string) =>
    shiftColorMap[type] ?? "bg-gray-100 text-gray-600";

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
      {/* Top action */}
      <div className="flex gap-2 mb-8">
        <Link
          to="/umkm/dashboard/data-shift"
          className="px-4 text-mint py-2.5 border hover:bg-mint-200/50 border-mint cursor-pointer text-sm rounded-md"
        >
          Lihat Data Shift
        </Link>
      </div>

      {shiftRows.length > 0 ? (
        <div className="space-y-6">
          {/* StatCards dari data asli */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                colorClass={card.colorClass}
              />
            ))}
          </div> */}

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {shiftTabs.map((type) => (
              <button
                key={type}
                onClick={() => setActiveShift(type)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  activeShift === type
                    ? "bg-mint text-white border-mint"
                    : "bg-white text-gray-500 border-gray-200 hover:border-mint hover:text-mint",
                )}
              >
                {type === "SEMUA"
                  ? "Semua"
                  : `Shift ${type.charAt(0) + type.slice(1).toLowerCase()}`}
              </button>
            ))}
          </div>

          {/* Worker List Card */}
          <div className="space-y-3">
            <TitleCard
              title="Daftar Pekerja Shift"
              link="/umkm/dashboard/data-shift"
            />
            <Card>
              <div className="flex flex-col">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-4 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-mint-200/30 flex items-center justify-center text-mint font-semibold text-sm shrink-0">
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <h3 className="font-medium text-black text-xs md:text-base">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-xs md:text-sm">
                            {item.role} &mdash; {item.job_title}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold capitalize",
                          getShiftColor(item.shift_type),
                        )}
                      >
                        {item.shift_type.charAt(0) +
                          item.shift_type.slice(1).toLowerCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-neutral-500 py-5">
                    Tidak ada pekerja untuk shift ini.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyData
          title="Belum Ada Jadwal Shift"
          description="Atur pembagian tugas harian agar operasional bisnis berjalan lancar. Tambahkan lowongan baru berbasis shift untuk mulai mengelola pekerjaan tim kamu."
          image={ImgEmptyData}
        />
      )}
    </section>
  );
}
