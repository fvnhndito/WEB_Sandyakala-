import { useState, useEffect } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { FiUser } from "react-icons/fi";
import { IoClose, IoCheckmark } from "react-icons/io5";
import { BsFilePdf } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/shared/lib/api";

interface Applicant {
  application_id: number;
  job_id: number;
  job_type: string;
  job_title: string;
  applicant_name: string;
  last_education: string;
  no_hp: string;
  applied_at: string;
  status: string;
  cv_url?: string;
  profile_pic?: string;
}

type ModalStep = "detail" | "tolak" | "ditolak" | "jadwal" | "terkirim" | null;

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

const getStatusBadge = (status: string) => {
  const classes: Record<string, string> = {
    ACCEPTED: "bg-success-100 text-success-300",
    REJECTED: "bg-error-100 text-error",
    PENDING: "bg-neutral-600/25 text-neutral-800",
    INTERVIEW: "bg-blue-100 text-blue-600",
  };
  return classes[status?.toUpperCase()] ?? "bg-neutral-200 text-neutral-600";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ACCEPTED: "Diterima",
    REJECTED: "Ditolak",
    PENDING: "Menunggu",
    INTERVIEW: "Interview",
  };
  return labels[status?.toUpperCase()] ?? status;
};

export default function DataLamaranMasuk() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State form jadwal interview
  const [pesanTolak, setPesanTolak] = useState("");
  const [metodeWawancara, setMetodeWawancara] = useState<
    "Google Meet" | "Tatap Muka"
  >("Google Meet");
  const [tanggalWawancara, setTanggalWawancara] = useState("");
  const [waktuMulaiWawancara, setWaktuMulaiWawancara] = useState("");
  const [waktuSelesaiWawancara, setWaktuSelesaiWawancara] = useState("");
  const [lokasiWawancara, setLokasiWawancara] = useState("");
  const [catatanWawancara, setCatatanWawancara] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    setError("");
    const res = await apiRequest<any>("/applications/umkm", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.success && res.data) {
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.applicants)
          ? res.data.applicants
          : [];
      setApplicants(list);
    } else {
      setError(res.message || "Gagal mengambil data pelamar");
    }
    setLoading(false);
  };

  const openDetail = (p: Applicant) => {
    setSelected(p);
    setModalStep("detail");
  };

  const closeModal = () => {
    setModalStep(null);
    setSelected(null);
    setPesanTolak("");
    setTanggalWawancara("");
    setWaktuMulaiWawancara("");
    setWaktuSelesaiWawancara("");
    setLokasiWawancara("");
    setCatatanWawancara("");
  };

  // Tolak lamaran
  const handleTolak = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    const res = await apiRequest(
      `/applications/${selected.application_id}/reject`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: pesanTolak }),
      },
    );
    setIsSubmitting(false);
    if (res.success) {
      setModalStep("ditolak");
      fetchApplicants();
    } else {
      alert(res.message || "Gagal menolak lamaran");
    }
  };

  // Jadwalkan interview
  const handleJadwalkan = async () => {
    if (
      !selected ||
      !tanggalWawancara ||
      !waktuMulaiWawancara ||
      !waktuSelesaiWawancara
    )
      return;
    setIsSubmitting(true);
    const res = await apiRequest(
      `/applications/${selected.application_id}/schedule-interview`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          date: tanggalWawancara,
          startTime: waktuMulaiWawancara,
          endTime: waktuSelesaiWawancara,
          type:
            metodeWawancara === "Google Meet" ? "Google Meet" : "Tatap Muka",
          link: lokasiWawancara,
          notes: catatanWawancara,
        }),
      },
    );
    setIsSubmitting(false);
    if (res.success) {
      setModalStep("terkirim");
      fetchApplicants();
    } else {
      alert(res.message || "Gagal menjadwalkan interview"); // atau pakai toast
    }
  };

  const filtered = applicants.filter((p) => {
    const matchStatus = selectedStatus
      ? p.status?.toUpperCase() === selectedStatus.toUpperCase()
      : true;
    const matchSearch = searchQuery
      ? p.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  return (
    <DataTaskLayout
      title="Data Pelamar"
      description="Kelola semua pelamar dalam satu tampilan"
      activeTab="lamaranMasuk"
      tabs={tabs}
      statusOptions={["PENDING", "INTERVIEW", "ACCEPTED", "REJECTED"]}
      onStatusChange={setSelectedStatus}
      onSearch={setSearchQuery}
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
                    Tanggal Melamar
                  </th>
                  <th className="border px-3 py-2">Status</th>
                  <th className="border px-3 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((p, index) => (
                    <tr
                      key={p.application_id}
                      className="hover:bg-neutral-100 transition text-center text-xs"
                    >
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2 font-semibold whitespace-nowrap">
                        {p.applicant_name}
                      </td>
                      <td className="border px-3 py-2">{p.job_title}</td>
                      <td className="border px-3 py-2">{p.last_education}</td>
                      <td className="border px-3 py-2">{p.no_hp}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">
                        {new Date(p.applied_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="border px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(p.status)}`}
                        >
                          {getStatusLabel(p.status)}
                        </span>
                      </td>
                      <td className="border px-3 py-2">
                        <button
                          onClick={() => openDetail(p)}
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
                      colSpan={8}
                      className="text-center py-5 text-neutral-500"
                    >
                      Tidak ada data pelamar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {modalStep && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          {/* Detail Pelamar */}
          {modalStep === "detail" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button onClick={closeModal}>
                  <IoClose className="text-xl text-gray-600 cursor-pointer" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Detail Pelamar</h2>
                  <p className="text-gray-400 text-sm">
                    {selected.applicant_name} - {selected.job_title}
                  </p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-5">
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
                      {selected.applicant_name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Melamar: {selected.job_title}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Tipe:{" "}
                      {selected.job_type === "PROJECT"
                        ? "Berbasis Proyek"
                        : "Shift Harian"}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                  INFORMASI PELAMAR
                </p>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm">
                    Pendidikan Terakhir
                  </span>
                  <span className="font-bold text-sm">
                    {selected.last_education}
                  </span>
                </div>
                <div className="flex justify-between py-2 mb-4">
                  <span className="text-gray-400 text-sm">No. HP</span>
                  <span className="font-bold text-sm">{selected.no_hp}</span>
                </div>

                {selected.cv_url && (
                  <>
                    <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                      DOKUMEN
                    </p>
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <BsFilePdf className="text-2xl text-blue-400" />
                        </div>
                        <p className="font-bold text-sm">
                          CV_{selected.applicant_name.replace(" ", "_")}.pdf
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
              {selected.status === "PENDING" && (
                <div className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => setModalStep("tolak")}
                    className="flex-1 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition"
                  >
                    Tolak Lamaran
                  </button>
                  <button
                    onClick={() => setModalStep("jadwal")}
                    className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
                  >
                    Terima & Jadwalkan Interview
                  </button>
                </div>
              )}
              {selected.status === "INTERVIEW" && (
                <div className="px-6 py-4">
                  <button
                    onClick={async () => {
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
                        fetchApplicants();
                        closeModal();
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Memproses..." : "Terima Sebagai Pekerja"}
                  </button>
                </div>
              )}
              {(selected.status === "ACCEPTED" ||
                selected.status === "REJECTED") && (
                <div className="px-6 py-4">
                  <p className="text-center text-sm text-neutral-500">
                    Status lamaran:{" "}
                    <span className="font-bold">
                      {getStatusLabel(selected.status)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tolak Lamaran */}
          {modalStep === "tolak" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button onClick={closeModal}>
                  <IoClose className="text-xl text-gray-600 cursor-pointer" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Tolak Lamaran</h2>
                  <p className="text-gray-400 text-sm">
                    {selected.applicant_name} - {selected.job_title}
                  </p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-5">
                <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">
                  ALASAN PENOLAKAN
                </p>
                <label className="text-sm text-gray-600 mb-2 block">
                  Pesan Penolakan
                </label>
                <textarea
                  value={pesanTolak}
                  onChange={(e) => setPesanTolak(e.target.value)}
                  placeholder="Tuliskan alasan penolakan..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm h-36 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={handleTolak}
                  disabled={isSubmitting || !pesanTolak.trim()}
                  className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Memproses..." : "Konfirmasi Penolakan"}
                </button>
              </div>
            </div>
          )}

          {/* Lamaran Ditolak */}
          {modalStep === "ditolak" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <IoClose className="text-3xl text-red-500" />
                </div>
                <h2 className="font-extrabold text-lg text-red-700 mb-2">
                  Lamaran Ditolak
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Lamaran {selected.applicant_name} untuk posisi{" "}
                  {selected.job_title} telah ditolak.
                </p>
              </div>
              <hr />
              <div className="px-6 py-4">
                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
                >
                  Lihat Lamaran Lainnya
                </button>
              </div>
            </div>
          )}

          {/* Jadwal Wawancara */}
          {modalStep === "jadwal" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button onClick={closeModal}>
                  <IoClose className="text-xl text-gray-600" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">
                    Jadwalkan Wawancara
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {selected.applicant_name} - {selected.job_title}
                  </p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs font-bold tracking-widest text-gray-700">
                  WAKTU INTERVIEW
                </p>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={tanggalWawancara}
                    onChange={(e) => setTanggalWawancara(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Waktu Mulai
                    </label>
                    <input
                      type="time"
                      value={waktuMulaiWawancara}
                      onChange={(e) => setWaktuMulaiWawancara(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Waktu Selesai
                    </label>
                    <input
                      type="time"
                      value={waktuSelesaiWawancara}
                      onChange={(e) => setWaktuSelesaiWawancara(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                </div>
                <p className="text-xs font-bold tracking-widest text-gray-700">
                  METODE INTERVIEW
                </p>
                <div className="flex gap-3">
                  {(["Google Meet", "Tatap Muka"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMetodeWawancara(m)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition ${metodeWawancara === m ? "bg-teal-50 border-teal-400 text-teal-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Link atau Lokasi
                  </label>
                  <input
                    type="text"
                    value={lokasiWawancara}
                    onChange={(e) => setLokasiWawancara(e.target.value)}
                    placeholder="meet.google.com/abc-xyz atau nama tempat"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Catatan Tambahan
                  </label>
                  <input
                    type="text"
                    value={catatanWawancara}
                    onChange={(e) => setCatatanWawancara(e.target.value)}
                    placeholder="Siapkan portofolio sebelum interview"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button
                  onClick={handleJadwalkan}
                  disabled={
                    isSubmitting ||
                    !tanggalWawancara ||
                    !waktuMulaiWawancara ||
                    !waktuSelesaiWawancara
                  }
                  className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Memproses..."
                    : "Konfirmasi & Kirim Undangan"}
                </button>
                <button
                  onClick={() => navigate("/chat")}
                  className="w-full py-3 rounded-xl border border-teal-600 text-teal-600 font-semibold text-sm hover:bg-teal-50 transition"
                >
                  Hubungi Pelamar
                </button>
              </div>
            </div>
          )}

          {/* Undangan Terkirim */}
          {modalStep === "terkirim" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center mb-4">
                  <IoCheckmark className="text-3xl text-white" />
                </div>
                <h2 className="font-extrabold text-lg text-teal-700 mb-3">
                  Undangan Terkirim!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {selected.applicant_name} telah diundang untuk interview pada{" "}
                  {tanggalWawancara}, {waktuMulaiWawancara} -{" "}
                  {waktuSelesaiWawancara} via {metodeWawancara}.
                </p>
                <hr className="w-full mb-4" />
                <div className="text-left w-full">
                  <p className="font-bold text-sm mb-1">Langkah Selanjutnya</p>
                  <p className="text-gray-500 text-sm">
                    Pantau status di tab{" "}
                    <span className="font-bold">Dalam Seleksi</span>. Setelah
                    interview, buka detail pelamar dan pilih{" "}
                    <span className="font-bold">Terima Sebagai Pekerja</span>.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button
                  onClick={() => navigate("/umkm/dashboard/dalam-seleksi")}
                  className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition"
                >
                  Lihat Jadwal Interview
                </button>
                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Lihat Lamaran Lainnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </DataTaskLayout>
  );
}
