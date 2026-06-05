import { useState, useEffect } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { apiRequest } from "@/shared/lib/api";
import { ModalPekerja } from "@/shared/components/ui/modal-pekerja";
import { DetailPekerjaContent } from "@/features/umkm/components/DetailPekerjaContent";
import type { Employee } from "@/features/umkm/types/dashboard.types";

export default function DataPekerja() {
  const token = localStorage.getItem("accessToken");
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    setError("");
    const res = await apiRequest<any>("/applications/umkm/workers", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.success && res.data) {
      const mapped: Employee[] = (Array.isArray(res.data) ? res.data : []).map((w: any) => ({
        id: String(w.employee_id),
        nama_pekerja: w.nama_pekerja,
        posisi_pekerja: w.posisi_pekerja,
        jenis_penugasan_pekerja: w.jenis_penugasan === "PROJECT" ? "Berbasis Proyek" : "Shift Harian",
        no_hp_pekerja: w.no_hp,
        tanggal_masuk_pekerja: w.tanggal_masuk,   
        status_pekerja: w.status_pekerja,         
        foto_pekerja: w.profile_pic ?? "",
      }));
      setEmployeeList(mapped);
    } else {
      setError(res.message || "Gagal mengambil data pekerja");
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: "Aktif" | "Nonaktif") => {
    const res = await apiRequest(`/applications/workers/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      setEmployeeList((prev) =>
        prev.map((emp) => emp.id === id ? { ...emp, status_pekerja: status } : emp)
      );
      setSelectedEmployee((prev) =>
        prev?.id === id ? { ...prev, status_pekerja: status } : prev
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      nonaktif: "bg-error-100 text-error",
      aktif: "bg-success-100/50 text-success-300",
    };
    return classes[status.toLowerCase()] ?? "";
  };

  const filtered = employeeList.filter((e) => {
    const matchStatus = filterStatus ? e.status_pekerja.toLowerCase() === filterStatus : true;
    const matchSearch = searchQuery
      ? e.nama_pekerja.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.posisi_pekerja.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  const statCardSlot = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      {[
        {
          title: "Pekerja Aktif",
          value: employeeList.filter((e) => e.status_pekerja === "Aktif").length,
          colorClass: "text-success-300",
          borderClass: "border-l-4 border-l-success-300",
        },
        {
          title: "Pekerja Nonaktif",
          value: employeeList.filter((e) => e.status_pekerja === "Nonaktif").length,
          colorClass: "text-error",
          borderClass: "border-l-4 border-l-error",
        },
        {
          title: "Total Pekerja",
          value: employeeList.length,
          colorClass: "text-neutral-700",
          borderClass: "border-l-4 border-l-neutral-600",
        },
      ].map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl border border-gray-100 shadow p-6 flex flex-col justify-center ${card.borderClass}`}
        >
          <h3 className={`text-sm font-medium mb-3 ${card.colorClass}`}>{card.title}</h3>
          <span className={`text-4xl font-bold ${card.colorClass}`}>{card.value || 0}</span>
        </div>
      ))}
    </div>
  );

  return (
    <DataTaskLayout
      title="Data Pekerja"
      description="Kelola semua pekerja dalam satu tampilan"
      statusOptions={["Aktif", "Nonaktif"]}
      statCardSlot={statCardSlot}
      onStatusChange={(status) => setFilterStatus(status)}
      onSearch={(query) => setSearchQuery(query)}
    >
      <div className="w-full px-2 sm:px-6">
        {loading ? (
          <p className="text-center py-10 text-neutral-500">Memuat data...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : (
          <div className="border border-neutral-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full table-auto border-collapse text-neutral-900">
              <thead>
                <tr className="bg-mint/15 text-center">
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm">No</th>
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm whitespace-nowrap">Nama Pekerja</th>
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm whitespace-nowrap">Posisi Pekerja</th>
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm whitespace-nowrap">Jenis Penugasan</th>
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm whitespace-nowrap">No Handphone</th>
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm whitespace-nowrap">Mulai Bergabung</th>
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm">Status</th>
                  <th className="border px-1.5 sm:px-3 py-2 sm:text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((emp, index) => (
                    <tr key={`${emp.id}-${index}`} className="hover:bg-neutral-100 transition text-center text-xs">
                      <td className="border px-1.5 sm:px-3 py-2">{index + 1}</td>
                      <td className="border px-1.5 sm:px-3 py-2 whitespace-nowrap">{emp.nama_pekerja}</td>
                      <td className="border px-1.5 sm:px-3 py-2 truncate">{emp.posisi_pekerja}</td>
                      <td className="border px-1.5 sm:px-3 py-2">{emp.jenis_penugasan_pekerja}</td>
                      <td className="border px-1.5 sm:px-3 py-2 whitespace-nowrap">{emp.no_hp_pekerja}</td>
                      <td className="border px-1.5 sm:px-3 py-2 whitespace-nowrap">
                        {new Date(emp.tanggal_masuk_pekerja).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </td>
                      <td className="border px-1.5 sm:px-3 py-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadge(emp.status_pekerja)}`}>
                          {emp.status_pekerja}
                        </span>
                      </td>
                      <td className="border px-1.5 sm:px-3 py-2">
                        <button
                          onClick={() => { setSelectedEmployee(emp); setOpen(true); }}
                          className="border border-primary-dark px-3 py-1 text-xs rounded-md hover:bg-primary-dark hover:text-white transition cursor-pointer"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-neutral-500">
                      Tidak ada data pekerja
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <ModalPekerja
          open={open}
          onClose={() => setOpen(false)}
          title="Detail Pekerja"
          status={selectedEmployee?.status_pekerja}
        >
          {selectedEmployee && (
            <DetailPekerjaContent
              employee={selectedEmployee}
              onClose={() => setOpen(false)}
              onUpdateStatusPekerja={handleUpdateStatus}
            />
          )}
        </ModalPekerja>
      </div>
    </DataTaskLayout>
  );
}