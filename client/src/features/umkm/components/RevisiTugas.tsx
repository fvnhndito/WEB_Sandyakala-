import { GoArrowLeft } from "react-icons/go";
import { Badge } from "@/shared/components/ui/badge";
import { FcFile } from "react-icons/fc";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { GoCheckCircle } from "react-icons/go";
import { useState } from "react";
import { GoX } from "react-icons/go";
import { ModalNotification } from "@/shared/components/ui/modal-notification";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/features/umkm/types/dashboard.types";

type RevisiTugasProps = {
  project: Project;
  onBack: () => void;
};

type PopupState =
  | { type: "none" }
  | { type: "pilih_tindakan" }
  | { type: "minta_revisi" };

type ModalState =
  | { visible: false }
  | { visible: true; type: "setuju" | "revisi" };

export default function RevisiTugas({ project, onBack }: RevisiTugasProps) {
  const [popup, setPopup] = useState<PopupState>({ type: "none" });
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [modal, setModal] = useState<ModalState>({ visible: false });

  const handleSetujui = () => {
    setPopup({ type: "none" });
    setModal({ visible: true, type: "setuju" });
  };

  const handleKirimRevisi = () => {
    setPopup({ type: "none" });
    setCatatanRevisi("");
    setModal({ visible: true, type: "revisi" });
  };

  const navigate = useNavigate();

  const handleGoToDataProject = () => {
    setModal({ visible: false });
    navigate("/umkm/dashboard/data-project");
  };

  return (
    <div className="bg-neutral-400 min-h-screen p-4 sm:p-10 lg:p-25 flex justify-center">
      <div className="bg-white w-full max-w-5xl px-4 sm:px-4 lg:px-12 py-6 rounded-lg shadow-md">
        {/* HEADER */}
        <div className="flex flex-row p-3 sm:p-5 items-center">
          <GoArrowLeft
            className="text-3xl mr-5 cursor-pointer"
            onClick={onBack}
          />
          <h3 className="font-extrabold text-h5">Revisi Hasil Kerja</h3>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col lg:flex-row gap-5 p-3 sm:p-5">
          {/* ISI */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            {/* DETAIL TUGAS */}
            <div className="flex flex-col gap-5 border border-neutral-300 rounded-lg w-full px-4 sm:px-10 py-5">
              <div className="flex flex-col gap-5 border-b pb-5">
                <div className="flex flex-row justify-between">
                  <h4 className="text-primary-dark text-lg">DETAIL TUGAS</h4>
                  <Badge
                    variant={"warning"}
                    size={"sm"}
                    className="bg-warning-200/50 border-none px-5"
                  >
                    {project.status_project}
                  </Badge>
                </div>
                <p className="text-xs text-justify">
                  {project.deskripsi_project}
                </p>
              </div>

              <table className="gap-5">
                <tr className="flex justify-between mb-2">
                  <th className="text-neutral-600 text-xs">
                    Penanggung Jawab Tim
                  </th>
                  <th className="text-neutral-600 text-xs">Dikumpulkan</th>
                </tr>
                <tr className="flex justify-between mb-5">
                  <td className="text-xs font-bold">
                    {project.penanggung_jawab_project}
                  </td>
                  <td className="text-xs">7 Maret 2026 20:21 WIB</td>
                </tr>
                <tr className="flex justify-between mb-2">
                  <th className="text-neutral-600 text-xs">Tahap</th>
                  <th className="text-neutral-600 text-xs">Tenggat Pengumpulan</th>
                </tr>
                <tr className="flex justify-between">
                  <td className="text-xs">Revisi ke-2</td>
                  <td className="text-xs text-error">
                    {new Date(
                      project.tanggal_selesai_project,
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              </table>
            </div>

            {/* CEK HASIL PEKERJAAN */}
            <div className="flex flex-col gap-5 border border-neutral-300 rounded-lg w-full px-4 sm:px-10 py-5">
              <h4 className="text-primary-dark text-lg">CEK HASIL PEKERJAAN</h4>
              <div className="flex flex-row border justify-between border-neutral-300 py-3 px-5 rounded-md">
                <div className="flex gap-3 items-center">
                  <FcFile className="text-lg" />
                  <p className="text-xs">Laporan_Panduan.pdf</p>
                </div>
                <Button
                  variant={"mint"}
                  size={"sm"}
                  className="border-mint-200 bg-white text-xs px-4"
                >
                  Lihat
                </Button>
              </div>

              <p className="text-xs font-bold">Catatan dari pekerja</p>
              <div className="flex flex-row border border-neutral-300 py-3 px-3 rounded-md">
                <Input
                  className="border-none text-xs p-2 placeholder:text-neutral-950"
                  placeholder="Desain telah diperbarui dengan memperbaiki layout dan konsistensi warna"
                />
              </div>

              <Button
                onClick={() => setPopup({ type: "pilih_tindakan" })}
                className="bg-primary-dark hover:bg-primary-dark/90"
              >
                Ambil Tindakan
              </Button>
            </div>
          </div>

          {/* RIWAYAT PERUBAHAN */}
          <div className="flex flex-col gap-5 border border-neutral-300 rounded-lg w-full lg:w-80 xl:w-96 px-5 py-5 h-fit shrink-0">
            <h4 className="text-primary-dark text-lg">RIWAYAT PERUBAHAN</h4>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex flex-row items-start gap-3">
                <GoCheckCircle className="text-2xl" />
                <div className="flex flex-col gap-1">
                  <h6 className="text-sm">Revisi</h6>
                  <p className="text-xs">25 Februari 2025, 16:00</p>
                  <div className="bg-neutral-200 p-3 rounded-lg mr-6">
                    <p className="text-[9px]">
                      Perbaikan pada tampilan sesuai feedback yang diberikan.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pilih Tindakan */}
      {popup.type === "pilih_tindakan" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setPopup({ type: "none" })}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm sm:max-w-lg flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row justify-between items-center w-full mb-1">
              <p className="font-semibold text-xl">Pilih Tindakan</p>
              <GoX
                onClick={() => setPopup({ type: "none" })}
                className="text-xl cursor-pointer text-neutral-500 hover:text-neutral-800"
              />
            </div>

            <button
              className="w-full bg-primary-dark text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark/90 cursor-pointer"
              onClick={handleSetujui}
            >
              Setujui Hasil Kerja
            </button>

            <button
              className="w-full border border-error text-error py-2.5 rounded-lg text-sm font-medium hover:bg-error/5 cursor-pointer"
              onClick={() => setPopup({ type: "minta_revisi" })}
            >
              Minta Revisi
            </button>
          </div>
        </div>
      )}

      {/* Minta Revisi */}
      {popup.type === "minta_revisi" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setPopup({ type: "none" })}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm sm:max-w-xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-xl text-error">Revisi Tugas</p>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-900">
                Tulis feedback atau catatan untuk pekerja
              </p>
              <textarea
                className="border border-neutral-300 rounded-md p-3 text-xs resize-none h-28 focus:outline-none focus:ring-1 focus:ring-primary-dark"
                placeholder="Tulis catatan revisi di sini..."
                value={catatanRevisi}
                onChange={(e) => setCatatanRevisi(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-primary-dark text-white px-6 py-2 rounded-lg text-sm hover:bg-primary-dark/90 cursor-pointer disabled:opacity-50"
                onClick={handleKirimRevisi}
                disabled={!catatanRevisi.trim()}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOTIFIKASI SETUJU */}
      <ModalNotification
        visible={modal.visible && modal.type === "setuju"}
        title="Konfirmasi persetujuan tugas telah dikirimkan kepada pekerja."
        button={{
          type: "single",
          label: "Lihat Tugas Lainnya",
          onPress: handleGoToDataProject,
        }}
      />

      {/* MODAL NOTIFIKASI REVISI */}
      <ModalNotification
        visible={modal.visible && modal.type === "revisi"}
        title="Pekerja akan segera menerima instruksi revisimu."
        subtitle="Cek berkala untuk melihat hasil pembaruannya."
        button={{
          type: "single",
          label: "Lihat Tugas Lainnya",
          onPress: handleGoToDataProject,
        }}
      />
    </div>
  );
}
