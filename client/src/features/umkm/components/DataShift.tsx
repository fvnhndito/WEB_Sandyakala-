import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { useState } from "react";
import { ModalShift } from "@/shared/components/ui/modal-shift";
import { DetailShiftContent } from "@/features/umkm/components/DetailShiftContent";
import type { Shift } from "@/features/umkm/types/dashboard.types";
import { useTask } from "../../../pages/umkm/TaskContext";


export default function DataShift() {
    const { shifts } = useTask();   

  const showDetailButtonShift = [
    "Review",
    "Disetujui",
    "Proses",
  ];

  const getStatusBadgeShift = (
    status_shift?: Shift["status_shift"],
  ) => {
    if (!status_shift) return "";

    const classesShift: Record<string, string> = {
      disetujui: "bg-success-100 text-success-300",
      proses: "bg-neutral-600/25 text-neutral-800",
      review: "bg-warning-200/50 text-warning-300",
    };

    return classesShift[status_shift.toLowerCase()] ?? "";
  };

  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] =
    useState<Shift | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterStatus, setFilterStatus] = useState<string>("");
  const filteredShifts = shifts.filter((e) => {
  const matchStatus = filterStatus
    ? e.status_shift.toLowerCase() === filterStatus
    : true;
  const matchSearch = searchQuery
    ? e.nama_pekerja_shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.nama_shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.divisi_shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.jenis_shift.toLowerCase().includes(searchQuery.toLowerCase())
    : true;
  return matchStatus && matchSearch;
});

  return (
    <DataTaskLayout
      title="Data Tugas Pekerja"
      description="Kelola semua tugas pekerja dalam satu tampilan"
      activeTab="dataShift"
      onStatusChange={(status) =>
      setFilterStatus(status.toLowerCase())
      }
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
      statusOptions={[
        "Disetujui",
        "Proses",
        "Review",
      ]}
    >
      <div className="w-full px-2 sm:px-6">
        <div className="border border-neutral-200 rounded-lg overflow-x-auto">
          <table className="min-w-fit w-full table-fixed border-collapse text-sm text-neutral-900">
            <thead>
              <tr className="bg-mint/15 text-center">
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-10">No</th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-30">
                  Nama Pekerja
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-22">
                  Tugas
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-24">
                  Waktu Shift
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-22">
                  Jenis Shift
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-22">
                  Tanggal Shift
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-18">
                  Jam Masuk
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-18">
                  Jam Pulang
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-18">
                  Status
                </th>
                <th className="border px-1.5 sm:px-3 py-2 sm:text-xs w-18">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredShifts.length > 0 ? (
                filteredShifts.map((shift, index) => (
                  <tr
                    key={shift.id}
                    className="hover:bg-neutral-100 transition text-center text-xs"
                  >
                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">
                      {index + 1}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold whitespace-nowrap wrap-break-word">
                          {shift.nama_pekerja_shift}
                        </span>

                        <span className="text-2xs text-neutral-500 wrap-break-word">
                          {shift.divisi_shift}
                        </span>
                      </div>
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs wrap-break-word">
                      {shift.nama_shift}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                      {shift.waktu_mulai_shift} -
                      {shift.waktu_selesai_shift}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs2 capitalize">
                      {shift.jenis_shift}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs whitespace-nowrap">
                      {new Date(
                        shift.tanggal_shift,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">
                      {shift.jam_masuk}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">
                      {shift.jam_pulang}
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadgeShift(
                          shift.status_shift,
                        )}`}
                      >
                        {shift.status_shift}
                      </span>
                    </td>

                    <td className="border px-1.5 sm:px-3 py-2 sm:text-xs">
                      {showDetailButtonShift.includes(
                        shift.status_shift,
                      ) && (
                        <button
                          onClick={() => {
                            setSelectedShift(shift);
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
                    Tidak ada data shift
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ModalShift
          open={open}
          onClose={() => setOpen(false)}
          title="Detail Shift"
          subtitle={selectedShift?.nama_pekerja_shift}
          subtitle2={selectedShift?.divisi_shift}
          status={selectedShift?.status_shift}
        >
          {selectedShift && (
            <DetailShiftContent
              shift={selectedShift}
              onClose={() => setOpen(false)}
            />
          )}
        </ModalShift>
      </div>
    </DataTaskLayout>
  );
}