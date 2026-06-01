import { useState, useEffect } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { apiRequest } from "@/shared/lib/api";

interface ShiftRow {
  job_id: number;
  job_title: string;
  job_category: string;
  shift_type: string;
  worker_name: string;
}

export default function DataShift() {
  const [shiftRows, setShiftRows] = useState<ShiftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterShift, setFilterShift] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    // 1. Ambil semua job milik UMKM + semua aplikasi sekaligus
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
      setError(listRes.message || "Gagal mengambil data shift");
      setLoading(false);
      return;
    }

    // 2. Semua aplikasi yang ACCEPTED, digroup by job_id
    const acceptedByJobId: Record<number, string[]> = {};
    if (appsRes.success && appsRes.data) {
      const apps = Array.isArray(appsRes.data)
        ? appsRes.data
        : (appsRes.data as any).applicants ?? [];

      apps
        .filter((a: any) => a.status === "ACCEPTED")
        .forEach((a: any) => {
          const jid = a.job_id;
          if (!acceptedByJobId[jid]) acceptedByJobId[jid] = [];
          if (a.applicant_name) acceptedByJobId[jid].push(a.applicant_name);
        });
    }

    // 3. Filter hanya tipe SHIFT
    const shiftJobs = (listRes.data as any[]).filter((j: any) => j.type === "SHIFT");

    // 4. Fetch detail tiap job untuk mendapatkan shifts & job_category
    const details = await Promise.all(
      shiftJobs.map((job: any) =>
        apiRequest<any>(`/jobs/${job.id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );

    // 5. Flatten shifts menjadi baris tabel
    const rows: ShiftRow[] = [];
    details.forEach((res) => {
      if (!res.success || !res.data) return;
      const job = res.data;
      const workers = acceptedByJobId[job.id] ?? [];
      const workerName = workers.length > 0 ? workers.join(", ") : "-";

      (job.shifts ?? []).forEach((shiftType: string) => {
        rows.push({
          job_id: job.id,
          job_title: job.title,
          job_category: job.job_category ?? "-",
          shift_type: shiftType,
          worker_name: workerName,
        });
      });
    });

    setShiftRows(rows);
    setLoading(false);
  };

  const filtered = shiftRows.filter((row) => {
    const matchShift = filterShift
      ? row.shift_type.toLowerCase() === filterShift.toLowerCase()
      : true;
    const matchSearch = searchQuery
      ? row.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.shift_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.worker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.job_category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchShift && matchSearch;
  });

  return (
    <DataTaskLayout
      title="Data Tugas Pekerja"
      description="Kelola semua tugas pekerja dalam satu tampilan"
      activeTab="dataShift"
      onStatusChange={setFilterShift}
      onSearch={setSearchQuery}
      tabs={[
        { label: "Proyek Masuk", path: "/umkm/dashboard/data-project", key: "dataProject" },
        { label: "Shift Harian", path: "/umkm/dashboard/data-shift", key: "dataShift" },
      ]}
      statusOptions={["PAGI", "SIANG", "MALAM"]}
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
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">Nama Pekerja</th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">Kategori Pekerja</th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">Tugas Shift</th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">Tipe Shift</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((row, index) => (
                    <tr
                      key={`${row.job_id}-${row.shift_type}-${index}`}
                      className="hover:bg-neutral-100 transition text-center text-xs"
                    >
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2">{row.worker_name}</td>
                      <td className="border px-3 py-2">{row.job_category}</td>
                      <td className="border px-3 py-2">{row.job_title}</td>
                      <td className="border px-3 py-2 capitalize">{row.shift_type}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-neutral-500">
                      Tidak ada data shift
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DataTaskLayout>
  );
}
