import { useState, useEffect } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { apiRequest } from "@/shared/lib/api";
import { IoClose } from "react-icons/io5";
import { FiUser } from "react-icons/fi";

interface Worker {
  name: string;
  no_hp: string;
  education: string;
}

interface ShiftRow {
  job_id: number;
  job_title: string;
  job_category: string;
  shift_type: string;
  workers: Worker[];
}

export default function DataShift() {
  const [shiftRows, setShiftRows] = useState<ShiftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [selected, setSelected] = useState<ShiftRow | null>(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Token tidak ditemukan");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [listRes, appsRes] = await Promise.all([
        apiRequest<any>("/jobs/umkm/me", {
          method: "GET",
          headers,
        }),
        apiRequest<any>("/applications/umkm", {
          method: "GET",
          headers,
        }),
      ]);

      if (!listRes.success || !listRes.data) {
        setError(listRes.message || "Gagal mengambil data shift");
        return;
      }

      const jobs = Array.isArray(listRes.data)
        ? listRes.data
        : [];

      const acceptedByJobId: Record<number, Worker[]> = {};

      if (appsRes.success && appsRes.data) {
        const applications = Array.isArray(appsRes.data)
          ? appsRes.data
          : appsRes.data.applicants ?? [];

        applications
          .filter((app: any) => app.status === "ACCEPTED")
          .forEach((app: any) => {
            const jobId = Number(app.job_id);

            if (!acceptedByJobId[jobId]) {
              acceptedByJobId[jobId] = [];
            }

            acceptedByJobId[jobId].push({
              name: app.applicant_name ?? "-",
              no_hp: app.no_hp ?? "-",
              education: app.last_education ?? "-",
            });
          });
      }

      const shiftJobs = jobs.filter(
        (job: any) => job.type === "SHIFT"
      );

      const detailResponses = await Promise.all(
        shiftJobs.map((job: any) =>
          apiRequest<any>(`/jobs/${job.id}`, {
            method: "GET",
            headers,
          })
        )
      );

      const rows: ShiftRow[] = [];

      detailResponses.forEach((response) => {
        if (!response.success || !response.data) return;

        const job = response.data;

        const workers = acceptedByJobId[job.id] ?? [];

        const shifts = Array.isArray(job.shifts)
          ? job.shifts
          : [];

        shifts.forEach((shiftType: string) => {
          rows.push({
            job_id: job.id,
            job_title: job.title ?? "-",
            job_category: job.job_category ?? "-",
            shift_type: shiftType,
            workers,
          });
        });
      });

      setShiftRows(rows);
    } catch (err) {
      console.error("Gagal mengambil data shift:", err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = shiftRows.filter((row) => {
    const query = searchQuery.toLowerCase();

    const matchShift = filterShift
      ? row.shift_type.toLowerCase() === filterShift.toLowerCase()
      : true;

    const matchSearch = query
      ? row.job_title.toLowerCase().includes(query) ||
        row.shift_type.toLowerCase().includes(query) ||
        row.job_category.toLowerCase().includes(query) ||
        row.workers.some((worker) =>
          worker.name.toLowerCase().includes(query)
        )
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
      statusOptions={["PAGI", "SIANG", "MALAM"]}
    >
      <div className="w-full px-2 sm:px-6">
        {loading ? (
          <p className="text-center py-10 text-neutral-500">
            Memuat data...
          </p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">
            {error}
          </p>
        ) : (
          <div className="border border-neutral-200 rounded-lg overflow-x-auto">
            <table className="min-w-fit w-full table-auto border-collapse text-sm text-neutral-900">
              <thead>
                <tr className="bg-mint/15 text-center">
                  <th className="border px-3 py-2 text-xs">No</th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">
                    Jumlah Pekerja
                  </th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">
                    Kategori Pekerjaan
                  </th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">
                    Tugas Shift
                  </th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">
                    Tipe Shift
                  </th>
                  <th className="border px-3 py-2 text-xs">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((row, index) => (
                    <tr
                      key={`${row.job_id}-${row.shift_type}`}
                      className="hover:bg-neutral-100 transition text-center text-xs"
                    >
                      <td className="border px-3 py-2">
                        {index + 1}
                      </td>

                      <td className="border px-3 py-2">
                        {row.workers.length > 0 ? (
                          <span className="inline-flex items-center justify-center w-20 h-7 rounded-full bg-mint/20 text-mint font-bold text-xs">
                            {row.workers.length} Orang
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-xs italic">
                            Belum ada
                          </span>
                        )}
                      </td>

                      <td className="border px-3 py-2">
                        {row.job_category}
                      </td>

                      <td className="border px-3 py-2">
                        {row.job_title}
                      </td>

                      <td className="border px-3 py-2 capitalize">
                        {row.shift_type}
                      </td>

                      <td className="border px-3 py-2">
                        <button
                          type="button"
                          onClick={() => setSelected(row)}
                          className="border border-primary-dark px-3 py-1 text-xs rounded-md hover:bg-primary-dark hover:text-white transition cursor-pointer"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-5 text-neutral-500"
                    >
                      Tidak ada data shift
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSelected(null)}
              >
                <IoClose className="text-xl text-gray-600 cursor-pointer" />
              </button>

              <div>
                <h2 className="font-extrabold text-lg">
                  Detail Shift
                </h2>
                <p className="text-gray-400 text-sm">
                  {selected.job_title} — {selected.shift_type}
                </p>
              </div>
            </div>

            <hr />

            <div className="px-6 py-4">
              <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                DAFTAR PEKERJA
              </p>

              {selected.workers.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                  {selected.workers.map((worker) => (
                    <div
                      key={`${worker.name}-${worker.no_hp}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <FiUser className="text-lg text-blue-400" />
                      </div>

                      <div className="flex-1">
                        <p className="font-bold text-sm">
                          {worker.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {worker.education} · {worker.no_hp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-neutral-400 py-4">
                  Belum ada pekerja yang diterima untuk shift ini
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </DataTaskLayout>
  );
}
