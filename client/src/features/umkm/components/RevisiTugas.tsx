import { GoArrowLeft } from "react-icons/go";
import { Badge } from "@/shared/components/ui/badge";
import { FcFile } from "react-icons/fc";
import { Button } from "@/shared/components/ui/button";
import { GoCheckCircle } from "react-icons/go";
import { GoX } from "react-icons/go";
import { ModalNotification } from "@/shared/components/ui/modal-notification";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/shared/lib/api";

interface TaskRow {
  id: number;
  job_id: number;
  task_name: string;
  task_order: number;
  project_start: string;
  project_end: string;
  status: string;
  submission_link?: string;
  revision_note?: string;
  job_title: string;
  worker_needed: number;
  worker_names?: string[];
}

interface Revision {
  id: number;
  submission_link: string;
  note?: string;
  revision_note?: string;
  status: string;
  submitted_at: string;
  submitted_by_name: string;
}

type RevisiTugasProps = {
  task: TaskRow;
  onBack: () => void;
};

type PopupState = { type: "none" } | { type: "pilih_tindakan" } | { type: "minta_revisi" };
type ModalState = { visible: false } | { visible: true; type: "setuju" | "revisi" };

export default function RevisiTugas({ task, onBack }: RevisiTugasProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [popup, setPopup] = useState<PopupState>({ type: "none" });
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [modal, setModal] = useState<ModalState>({ visible: false });
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchRevisions();
  }, []);

  const fetchRevisions = async () => {
    setLoadingRevisions(true);
    const res = await apiRequest<any>(`/tasks/${task.id}/revisions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.success && res.data) {
      const data = Array.isArray(res.data) ? res.data : [];
      setRevisions(data);
    } else {
      setRevisions([]);
    }

    setLoadingRevisions(false);
  };

  // Setujui → PUT /api/tasks/:taskId/review dengan is_approved: true
  const handleSetujui = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await apiRequest(`/tasks/${task.id}/review`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_approved: true }),
    });
    setIsSubmitting(false);
    setPopup({ type: "none" });

    if (res.success) {
      setModal({ visible: true, type: "setuju" });
    } else {
      setErrorMsg(res.message || "Gagal menyetujui tugas");
    }
  };

  // Minta revisi → PUT /api/tasks/:taskId/review dengan is_approved: false + revision_note
  const handleKirimRevisi = async () => {
    if (!catatanRevisi.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const res = await apiRequest(`/tasks/${task.id}/review`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_approved: false, revision_note: catatanRevisi }),
    });

    setIsSubmitting(false);
    setPopup({ type: "none" });

    if (res.success) {
      setCatatanRevisi("");
      setModal({ visible: true, type: "revisi" });
    } else {
      setErrorMsg(res.message || "Gagal mengirim catatan revisi");
    }
  };

  const handleGoToDataProject = () => {
    setModal({ visible: false });
    navigate("/umkm/dashboard/data-project");
    onBack();
  };

  const latestRevision = revisions.length > 0 ? revisions[0] : null;
  const submissionLink = latestRevision?.submission_link ?? task.submission_link;
  const latestNote = latestRevision?.note;

  // const getStatusBadgeVariant = (status: string) => {
  //   const s = status?.toUpperCase();
  //   if (s === "REVIEW") return "warning";
  //   if (s === "REVISI") return "destructive";
  //   if (s === "SELESAI") return "default";
  //   return "secondary";
  // };

  return (
    <div className="bg-neutral-400 min-h-screen p-4 sm:p-10 lg:p-25 flex justify-center">
      <div className="bg-white w-full max-w-5xl px-4 sm:px-4 lg:px-12 py-6 rounded-lg shadow-md">

        {/* HEADER */}
        <div className="flex flex-row p-3 sm:p-5 items-center">
          <GoArrowLeft className="text-3xl mr-5 cursor-pointer" onClick={onBack} />
          <h3 className="font-extrabold text-h5">Revisi Hasil Kerja</h3>
        </div>

        {errorMsg && (
          <div className="mx-5 mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-5 p-3 sm:p-5">

          <div className="flex flex-col gap-6 flex-1 min-w-0">

            {/* DETAIL TUGAS */}
            <div className="flex flex-col gap-5 border border-neutral-300 rounded-lg w-full px-4 sm:px-10 py-5">
              <div className="flex flex-col gap-5 border-b pb-5">
                <div className="flex flex-row justify-between">
                  <h4 className="text-primary-dark text-lg">DETAIL TUGAS</h4>
                  <Badge variant={"warning"} size={"sm"} className="bg-warning-200/50 border-none px-5">
                    {task.status}
                  </Badge>
                </div>
                <p className="text-xs text-justify font-semibold">{task.task_name}</p>
              </div>

              <table>
                <tbody>
                  <tr className="flex justify-between mb-2">
                    <th className="text-neutral-600 text-xs font-normal">Nama Proyek</th>
                    <th className="text-neutral-600 text-xs font-normal">Mulai Tugas</th>
                  </tr>
                  <tr className="flex justify-between mb-5">
                    <td className="text-xs font-bold">{task.job_title}</td>
                    <td className="text-xs">
                      {new Date(task.project_start).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr className="flex justify-between mb-2">
                    <th className="text-neutral-600 text-xs font-normal">Urutan Tugas</th>
                    <th className="text-neutral-600 text-xs font-normal">Tenggat Tugas</th>
                  </tr>
                  <tr className="flex justify-between">
                    <td className="text-xs">Tugas ke-{task.task_order}</td>
                    <td className="text-xs text-error">
                      {new Date(task.project_end).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CEK HASIL PEKERJAAN */}
            <div className="flex flex-col gap-5 border border-neutral-300 rounded-lg w-full px-4 sm:px-10 py-5">
              <h4 className="text-primary-dark text-lg">CEK HASIL PEKERJAAN</h4>

              {submissionLink ? (
                <div className="flex flex-row border justify-between border-neutral-300 py-3 px-5 rounded-md">
                  <div className="flex gap-3 items-center overflow-hidden">
                    <FcFile className="text-lg shrink-0" />
                    <p className="text-xs truncate">{submissionLink}</p>
                  </div>
                  <a href={submissionLink} target="_blank" rel="noopener noreferrer">
                    <Button variant={"mint"} size={"sm"} className="border-mint-200 bg-white text-xs px-4 ml-2 shrink-0">
                      Lihat
                    </Button>
                  </a>
                </div>
              ) : (
                <p className="text-xs text-neutral-500/50 italic">
                  Belum ada hasil pekerjaan yang dikumpulkan.
                </p>
              )}

              {/* Catatan dari pekerja — dari riwayat terbaru */}
              {latestNote && (
                <>
                  <p className="text-xs font-bold">Catatan dari pekerja</p>
                  <div className="border border-neutral-300 py-3 px-3 rounded-md">
                    <p className="text-xs text-neutral-700">{latestNote}</p>
                  </div>
                </>
              )}

              {/* Catatan revisi UMKM jika status REVISI */}
              {task.status?.toUpperCase() === "REVISI" && task.revision_note && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-bold text-orange-700 mb-1">Catatan Revisi:</p>
                  <p className="text-xs text-orange-600">{task.revision_note}</p>
                </div>
              )}

              {/* Sudah selesai */}
              {task.status?.toUpperCase() === "SELESAI" && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
                  <p className="text-xs font-bold text-green-700">✓ Tugas telah disetujui</p>
                </div>
              )}

              {/* Tombol Ambil Tindakan hanya jika REVIEW dan ada submission */}
              {task.status?.toUpperCase() === "REVIEW" && submissionLink && (
                <Button
                  onClick={() => setPopup({ type: "pilih_tindakan" })}
                  className="bg-primary-dark hover:bg-primary-dark/90"
                  disabled={isSubmitting}
                >
                  Ambil Tindakan
                </Button>
              )}

              {/* Belum ada submission */}
              {task.status?.toUpperCase() === "REVIEW" && !submissionLink && (
                <p className="text-xs text-primary-dark italic text-center">
                  Menunggu pekerja mengumpulkan hasil kerja.
                </p>
              )}
            </div>
          </div>

          {/* RIWAYAT PERUBAHAN */}
          <div className="flex flex-col gap-5 border border-neutral-300 rounded-lg w-full lg:w-80 xl:w-96 px-5 py-5 h-fit shrink-0">
            <h4 className="text-primary-dark text-lg">RIWAYAT PERUBAHAN</h4>

            {loadingRevisions ? (
              <p className="text-xs text-neutral-400">Memuat riwayat...</p>
            ) : revisions.length > 0 ? (
              revisions.map((rev) => (
                <div key={rev.id} className="flex flex-row items-start gap-3">
                  <GoCheckCircle className="text-2xl shrink-0 text-primary-dark" />
                  <div className="flex flex-col gap-1 w-full">
                    <h6 className="text-sm font-semibold">{rev.submitted_by_name}</h6>
                    <p className="text-xs text-neutral-500">
                      {new Date(rev.submitted_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}{", "}
                      {new Date(rev.submitted_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                    {rev.note && (
                      <div className="bg-neutral-200 p-3 rounded-lg mr-2">
                        <p className="text-10 text-neutral-700">{rev.note}</p>
                      </div>
                    )}
                    {rev.revision_note && (
                      <div className="bg-orange-100 p-3 rounded-lg mr-2 mt-1">
                        <p className="text-10 text-orange-700">
                          Catatan UMKM: {rev.revision_note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500/75 italic">
                Belum ada riwayat perubahan.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Popup: Pilih Tindakan */}
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
              className="w-full bg-primary-dark text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark/90 cursor-pointer disabled:opacity-50"
              onClick={handleSetujui}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Setujui Hasil Kerja"}
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

      {/* Popup: Minta Revisi */}
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
              <p className="text-xs text-neutral-900">Tulis feedback atau catatan untuk pekerja</p>
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
                disabled={!catatanRevisi.trim() || isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Notifikasi Setuju */}
      <ModalNotification
        visible={modal.visible && modal.type === "setuju"}
        title="Konfirmasi persetujuan tugas telah dikirimkan kepada pekerja."
        button={{
          type: "single",
          label: "Lihat Tugas Lainnya",
          onPress: handleGoToDataProject,
        }}
      />

      {/* Modal Notifikasi Revisi */}
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
