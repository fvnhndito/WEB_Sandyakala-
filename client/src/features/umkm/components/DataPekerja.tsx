import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import type { Employee } from "@/features/umkm/types/dashboard.types";
import { useState } from "react";
import { ModalPekerja } from "@/shared/components/ui/modal-pekerja";
import { DetailPekerjaContent } from "@/features/umkm/components/DetailPekerjaContent";

const employees: Employee[] = [
  {
    id: "1",
    nama_pekerja: "Budi Santoso",
    posisi_pekerja: "UI/UX Designer",
    jenis_penugasan_pekerja: "Berbasis Proyek",
    no_hp_pekerja: "081234567890",
    tanggal_masuk_pekerja: "2024-01-10",
    status_pekerja: "Aktif",
    foto_pekerja: "https://i.pravatar.cc/150",
  },
  {
    id: "1",
    nama_pekerja: "Budi Santoso",
    posisi_pekerja: "UI/UX Designer",
    jenis_penugasan_pekerja: "Berbasis Proyek",
    no_hp_pekerja: "081234567890",
    tanggal_masuk_pekerja: "2024-01-10",
    status_pekerja: "Nonaktif",
    foto_pekerja: "https://i.pravatar.cc/150",
  },
];

export default function DataPekerja() {
  const showDetailButtonEmployee = ["Aktif", "Nonaktif"];

  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  // Atur status project
  const getStatusBadgeEmployee = (
    status_pekerja: Employee["status_pekerja"],
  ) => {
    const classesEmployee: Record<string, string> = {
      nonaktif: "bg-error-100 text-error",
      aktif: "bg-success-100/50 text-success-300",
    };
    return classesEmployee[status_pekerja.toLowerCase()] ?? "";
  };

  const statCardSlot = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 mb-4">
      {[
        {
          title: "Pekerja Aktif",
          value: employees.filter((e) => e.status_pekerja === "Aktif").length,
          colorClass: "text-success-300",
          borderClass: "border-l-4 border-l-success-300",
        },
        {
          title: "Pekerja Nonaktif",
          value: employees.filter((e) => e.status_pekerja === "Nonaktif")
            .length,
          colorClass: "text-error",
          borderClass: "border-l-4 border-l-error",
        },
        {
          title: "Total Pekerja",
          value: employees.length,
          colorClass: "text-neutral-700",
          borderClass: "border-l-4 border-l-neutral-600",
        },
      ].map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl border border-gray-100 shadow p-6 flex flex-col justify-center ${card.borderClass}`}
        >
          <h3 className={`text-sm font-medium mb-3 ${card.colorClass}`}>
            {card.title}
          </h3>
          <span className={`text-4xl font-bold ${card.colorClass}`}>
            {card.value || 0}
          </span>
        </div>
      ))}
    </div>
  );

  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);

  const handleUpdateStatus = (id: string, status: "Aktif" | "Nonaktif") => {
    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, status_pekerja: status } : emp,
      ),
    );
    setSelectedEmployee((prev) =>
      prev?.id === id ? { ...prev, status_pekerja: status } : prev,
    );
  };

  const [filterStatus, setFilterStatus] = useState<string>("");

  const filteredEmployees = filterStatus
    ? employeeList.filter((e) => e.status_pekerja.toLowerCase() === filterStatus)
    : employeeList;

  return (
    <DataTaskLayout
      title="Data Pekerja"
      description="Kelola semua pekerja dalam satu tampilan"
      statusOptions={["Aktif", "Nonaktif"]}
      statCardSlot={statCardSlot}
      onStatusChange={(status) => setFilterStatus(status)}
    >
      <div className="w-full px-6">
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full table-auto border-collapse text-sm text-neutral-900">
            <thead>
              <tr className="bg-mint/15 text-center">
                <th className="border px-3 py-2">No</th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Nama Pekerja
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Posisi Pekerja
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Jenis Penugasan
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  No Handphone
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Mulai Bergabung
                </th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((Employee, index) => (
                  <tr
                    key={Employee.id ?? index}
                    className="hover:bg-neutral-100 transition text-center text-xs"
                  >
                    <td className="border px-3 py-2">{index + 1}</td>

                    <td className="border px-3 py-2 whitespace-nowrap">
                      {Employee.nama_pekerja}
                    </td>

                    <td className="border px-3 py-2 max-w-160px truncate">
                      {Employee.posisi_pekerja}
                    </td>

                    <td className="border px-3 py-2 capitalize">
                      {Employee.jenis_penugasan_pekerja}
                    </td>

                    <td className="border px-3 py-2 whitespace-nowrap">
                      {Employee.no_hp_pekerja}
                    </td>

                    <td className="border px-3 py-2 whitespace-nowrap">
                      {new Date(
                        Employee.tanggal_masuk_pekerja,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadgeEmployee(
                          Employee.status_pekerja,
                        )}`}
                      >
                        {Employee.status_pekerja}
                      </span>
                    </td>

                    <td className="border px-3 py-2">
                      {showDetailButtonEmployee.includes(
                        Employee.status_pekerja,
                      ) && (
                        <button
                          onClick={() => {
                            setSelectedEmployee(Employee);
                            setOpen(true);
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
                    Tidak ada data pekerja
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* modal detail pekerja */}
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
