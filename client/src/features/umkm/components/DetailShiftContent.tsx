import { ModalNotification } from "@/shared/components/ui/modal-notification";
import { useState } from "react";

// data dari shift
type Shift = {
  id: number;
  divisi_shift: string;
  nama_pekerja_shift: string;
  nama_shift: string;
  list_tugas_shift: string[];
  waktu_mulai_shift: string;
  waktu_selesai_shift: string;
  jenis_shift: string;
  tanggal_shift: string;
  jam_masuk: string;
  jam_pulang: string;
  status_shift: "Disetujui" | "Proses" | "Review";
};

type Props = {
  shift: Shift;
  onClose: () => void;
};

export function DetailShiftContent({ shift, onClose }: Props) {
  // untuk atur button saat status shift berubah
  const isProses = shift.status_shift === "Proses";
  const isReview = shift.status_shift === "Review";
  const isDisetujui = shift.status_shift === "Disetujui";

  // ini list dari tugas shift
  const checklist = shift.list_tugas_shift ?? [];
  const isDone = shift.status_shift === "Disetujui";

  const completed = isDisetujui ? checklist.length : 0;

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: "setuju";
  }>({ visible: false, type: "setuju" });

  return (
    <div className="flex flex-col gap-5">
      {/* GRID DETAIL */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-100 rounded-lg p-3">
          {/* tanggal shift */}
          <p className="text-xs text-neutral-500 mb-2">Tanggal Shift</p>
          <p className="font-semibold text-sm text-primary-dark">
            {new Date(shift.tanggal_shift).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        
        {/* waktu shift */}
        <div className="bg-neutral-100 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-2">Waktu Shift</p>
          <p className="font-semibold text-sm text-primary-dark">
            {shift.waktu_mulai_shift} - {shift.waktu_selesai_shift}
          </p>
        </div>

        <div className="bg-neutral-100 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-2">Jam Masuk</p>
          <p className="font-semibold text-sm text-primary-dark">
            {shift.jam_masuk}
          </p>
        </div>

        <div className="bg-neutral-100 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-2">Jam Pulang</p>
          <p className="font-semibold text-sm text-primary-dark">
            {shift.jam_pulang || "--:--"}
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="flex justify-between text-sm mb-3">
          <span>Progress Tugas</span>
          <span className="text-green-500">
            {completed}/{checklist.length} Terselesaikan
          </span>
        </div>

        <div className="h-2 bg-neutral-200 rounded-full">
          <div
            className="h-2 bg-green-500 rounded-full transition-all"
            style={{ width: `${(completed / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      {/* CHECKLIST */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-neutral-600">Checklist</p>

        {checklist.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {/* checkbox */}
            <div
              className={`w-4 h-4 mt-1 rounded border flex items-center justify-center ${
                isDone ? "bg-green-500 text-white" : ""
              }`}
            >
              {isDone}
            </div>

            {/* teks */}
            <p
              className={`text-sm ${
                isDone ? "line-through text-neutral-700" : ""
              }`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="mt-4">
        {/* kalo status review button nya setujui */}
        {isReview && (
          <button
            onClick={() => setModalConfig({ visible: true, type: "setuju" })}
            className="w-full bg-primary-dark text-white py-2 rounded-md cursor-pointer hover:bg-primary-dark/75"
          >
            Setujui
          </button>
        )}

        {/* kalo status proses dan disetujui button nya kembali */}
        {(isProses || isDisetujui) && (
          <button
            onClick={onClose}
            className="w-full border border-neutral-500 py-2 rounded-md cursor-pointer hover:bg-neutral-500/25"
          >
            Kembali
          </button>
        )}
      </div>

      {/* Modal Konfirmasi */}
      <ModalNotification
        visible={modalConfig.visible}
        title="Persetujuan shift telah berhasil dilakukan!"
        subtitle="Status tugas pekerja ini kini tercatat sebagai selesai."
        button={{
          type: "single",
          label: "Lihat Shift Lainnya",
          onPress: () => {
            setModalConfig((prev) => ({ ...prev, visible: false }));
            onClose();
          },
        }}
        onClose={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
