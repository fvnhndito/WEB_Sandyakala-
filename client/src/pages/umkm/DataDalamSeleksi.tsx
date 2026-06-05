import { useState, useEffect } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { apiRequest } from "@/shared/lib/api";
import { IoClose, IoCheckmark } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { BsFilePdf } from "react-icons/bs";

interface Interview {
  interview_id: number;
  application_id: number;
  tanggal_wawancara: string;
  metode_wawancara: string;
  tautan_wawancara: string;
  status_wawancara: string;
  application_status: string;
  nama_pelamar: string;
  posisi_lowongan: string;
  job_type: string;
  job_id: number;
  pendidikan_terakhir_pelamar: string;
  kontak_pelamar: string;
  profile_pic: string | null;
  cv_url?: string;
}

type ModalType =
  | "detail"
  | "terima"
  | "tolak"
  | "berhasil-terima"
  | "berhasil-tolak"
  | null;

const tabs = [
  {
    label: "Lamaran Masuk",
    path: "/umkm/dashboard/lamaran-masuk",
    key: "lamaranMasuk",
  },
  {
    label: "Dalam Seleksi",
    path: "/umkm/dashboard/dalam-seleksi",
    key: "dalamSeleksi",
  },
  {
    label: "Posisi Terbuka",
    path: "/umkm/dashboard/posisi-terbuka",
    key: "posisiTerbuka",
  },
];

const getAppStatusBadge = (status: string) => {
  const classes: Record<string, string> = {
    ACCEPTED: "bg-green-100 text-green-600",
    REJECTED: "bg-red-100 text-red-500",
    INTERVIEW: "bg-blue-100 text-blue-600",
    PENDING: "bg-neutral-200 text-neutral-600",
  };
  return classes[status?.toUpperCase()] ?? "bg-neutral-200 text-neutral-600";
};

const getAppStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ACCEPTED: "Diterima",
    REJECTED: "Ditolak",
    INTERVIEW: "Interview",
    PENDING: "Menunggu",
  };
  return labels[status?.toUpperCase()] ?? status;
};

export default function DataDalamSeleksi() {
  const token = localStorage.getItem("accessToken");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Interview | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // interview
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    setError("");
    const res = await apiRequest<any>("/applications/umkm/interviews", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.success && res.data) {
      setInterviews(Array.isArray(res.data) ? res.data : []);
    } else {
      setError(res.message || "Gagal mengambil data wawancara");
    }
    setLoading(false);
  };

  // terima interview
  const handleTerima = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    const res = await apiRequest(
      `/applications/${selected.application_id}/accept`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setIsSubmitting(false);
    if (res.success) {
      setModalType("berhasil-terima");
      fetchInterviews();
    } else {
      alert(res.message || "Gagal menerima pelamar");
    }
  };

  // tolak interview
  const handleTolak = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    const res = await apiRequest(
      `/applications/${selected.application_id}/reject`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: "Tidak lolos tahap wawancara" }),
      },
    );
    setIsSubmitting(false);
    if (res.success) {
      setModalType("berhasil-tolak");
      fetchInterviews();
    } else {
      alert(res.message || "Gagal menolak pelamar");
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelected(null);
  };

  const filtered = interviews.filter((p) =>
    searchQuery
      ? p.nama_pelamar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.posisi_lowongan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pendidikan_terakhir_pelamar
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true,
  );

  return (
    <DataTaskLayout
      title="Wawancara Pelamar"
      description="Lihat semua wawancara pelamar dalam satu tampilan"
      activeTab="dalamSeleksi"
      tabs={tabs}
      statusOptions={["Wawancara"]}
      onSearch={(query) => setSearchQuery(query)}
    >
      <div className="w-full px-2 sm:px-6">
        {loading ? (
          <p className="text-center py-10 text-neutral-500">Memuat data...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : (
          <div className="border border-neutral-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full min-w-fit table-auto border-collapse text-sm text-neutral-900">
              <thead>
                <tr className="bg-mint/15 text-center">
                  <th className="border px-3 py-2">No</th>
                  <th className="border px-3 py-2 whitespace-nowrap">
                    Nama Pelamar
                  </th>
                  <th className="border px-3 py-2">Posisi</th>
                  <th className="border px-3 py-2 whitespace-nowrap">
                    Pendidikan
                  </th>
                  <th className="border px-3 py-2 whitespace-nowrap">No HP</th>
                  <th className="border px-3 py-2 whitespace-nowrap">
                    Jadwal Interview
                  </th>
                  <th className="border px-3 py-2">Metode</th>
                  <th className="border px-3 py-2">Status</th>
                  <th className="border px-3 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((p, index) => (
                    <tr
                      key={p.interview_id}
                      className="hover:bg-neutral-100 transition text-center text-xs"
                    >
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2 font-semibold whitespace-nowrap">
                        {p.nama_pelamar}
                      </td>
                      <td className="border px-3 py-2">{p.posisi_lowongan}</td>
                      <td className="border px-3 py-2">
                        {p.pendidikan_terakhir_pelamar}
                      </td>
                      <td className="border px-3 py-2">{p.kontak_pelamar}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">
                        {new Date(p.tanggal_wawancara).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="border px-3 py-2">{p.metode_wawancara}</td>
                      <td className="border px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getAppStatusBadge(p.application_status)}`}
                        >
                          {getAppStatusLabel(p.application_status)}
                        </span>
                      </td>
                      <td className="border px-3 py-2">
                        <button
                          onClick={() => {
                            setSelected(p);
                            setModalType("detail");
                          }}
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
                      colSpan={9}
                      className="text-center py-5 text-neutral-500"
                    >
                      Tidak ada data wawancara
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalType && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          {/* Detail Pelamar */}
          {modalType === "detail" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button onClick={closeModal}>
                  <IoClose className="text-xl text-gray-600 cursor-pointer" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Detail Pelamar</h2>
                  <p className="text-gray-400 text-sm">
                    {selected.nama_pelamar} - {selected.posisi_lowongan}
                  </p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-5">
                {/* Foto & Identitas */}
                <div className="flex items-center gap-4 mb-6">
                  {selected.profile_pic ? (
                    <img
                      src={selected.profile_pic}
                      alt="foto"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-3xl text-blue-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-lg">
                      {selected.nama_pelamar}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Melamar: {selected.posisi_lowongan}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Tipe:{" "}
                      {selected.job_type === "PROJECT"
                        ? "Berbasis Proyek"
                        : "Shift Harian"}
                    </p>
                  </div>
                </div>

                {/* Info Pelamar */}
                <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                  INFORMASI PELAMAR
                </p>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">
                    Pendidikan Terakhir
                  </span>
                  <span className="font-bold text-sm">
                    {selected.pendidikan_terakhir_pelamar}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">No. HP</span>
                  <span className="font-bold text-sm">
                    {selected.kontak_pelamar}
                  </span>
                </div>

                {/* Info Interview */}
                <p className="text-xs font-bold tracking-widest text-gray-500 mt-4 mb-3">
                  JADWAL INTERVIEW
                </p>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">Tanggal</span>
                  <span className="font-bold text-sm">
                    {new Date(selected.tanggal_wawancara).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">Metode</span>
                  <span className="font-bold text-sm">
                    {selected.metode_wawancara}
                  </span>
                </div>
                <div className="flex justify-between py-2 mb-2">
                  <span className="text-gray-400 text-sm">Link / Lokasi</span>
                  <span className="font-bold text-sm text-right max-w-200 truncate">
                    {selected.tautan_wawancara || "-"}
                  </span>
                </div>

                {/* CV */}
                {selected.cv_url && (
                  <>
                    <p className="text-xs font-bold tracking-widest text-gray-500 mt-4 mb-3">
                      DOKUMEN
                    </p>
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <BsFilePdf className="text-2xl text-blue-400" />
                        </div>
                        <p className="font-bold text-sm">
                          CV_{selected.nama_pelamar.replace(" ", "_")}.pdf
                        </p>
                      </div>
                      <a
                        href={selected.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold text-sm hover:underline"
                      >
                        Unduh
                      </a>
                    </div>
                  </>
                )}
              </div>
              <hr />

              {/* Tombol Aksi sesuai status */}
              {(selected.application_status === "INTERVIEW" ||
                selected.application_status === "PENDING") && (
                <div className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => setModalType("tolak")}
                    className="flex-1 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => setModalType("terima")}
                    className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition"
                  >
                    Terima Sebagai Pekerja
                  </button>
                </div>
              )}
              {(selected.application_status === "ACCEPTED" ||
                selected.application_status === "REJECTED") && (
                <div className="px-6 py-4">
                  <p className="text-center text-sm text-neutral-500">
                    Status lamaran:{" "}
                    <span className="font-bold">
                      {getAppStatusLabel(selected.application_status)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Konfirmasi Terima */}
          {modalType === "terima" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button onClick={() => setModalType("detail")}>
                  <IoClose className="text-xl text-gray-600 cursor-pointer" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Terima Pelamar</h2>
                  <p className="text-gray-400 text-sm">
                    {selected.nama_pelamar} - {selected.posisi_lowongan}
                  </p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Apakah kamu yakin ingin menerima{" "}
                  <span className="font-bold">{selected.nama_pelamar}</span>{" "}
                  sebagai pekerja untuk posisi{" "}
                  <span className="font-bold">{selected.posisi_lowongan}</span>?
                </p>
              </div>
              <hr />
              <div className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => setModalType("detail")}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleTerima}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Memproses..." : "Ya, Terima"}
                </button>
              </div>
            </div>
          )}

          {/* Konfirmasi Tolak */}
          {modalType === "tolak" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button onClick={() => setModalType("detail")}>
                  <IoClose className="text-xl text-gray-600 cursor-pointer" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Tolak Pelamar</h2>
                  <p className="text-gray-400 text-sm">
                    {selected.nama_pelamar} - {selected.posisi_lowongan}
                  </p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Apakah kamu yakin ingin menolak{" "}
                  <span className="font-bold">{selected.nama_pelamar}</span>{" "}
                  untuk posisi{" "}
                  <span className="font-bold">{selected.posisi_lowongan}</span>?
                </p>
              </div>
              <hr />
              <div className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => setModalType("detail")}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleTolak}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Memproses..." : "Ya, Tolak"}
                </button>
              </div>
            </div>
          )}

          {/* Berhasil Terima */}
          {modalType === "berhasil-terima" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center mb-4">
                  <IoCheckmark className="text-3xl text-white" />
                </div>
                <h2 className="font-extrabold text-lg text-teal-700 mb-2">
                  Pelamar Diterima!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {selected.nama_pelamar} resmi diterima sebagai pekerja untuk
                  posisi {selected.posisi_lowongan}.
                </p>
              </div>
              <hr />
              <div className="px-6 py-4">
                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

          {/* Berhasil Tolak */}
          {modalType === "berhasil-tolak" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <IoClose className="text-3xl text-red-500" />
                </div>
                <h2 className="font-extrabold text-lg text-red-700 mb-2">
                  Pelamar Ditolak
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {selected.nama_pelamar} telah ditolak untuk posisi{" "}
                  {selected.posisi_lowongan}.
                </p>
              </div>
              <hr />
              <div className="px-6 py-4">
                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </DataTaskLayout>
  );
}
