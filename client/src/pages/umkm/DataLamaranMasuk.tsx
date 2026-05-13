import { useState } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { FiUser } from "react-icons/fi";
import { IoClose, IoCheckmark } from "react-icons/io5";
import { BsFilePdf } from "react-icons/bs";
import type { Pelamar } from "@/features/umkm/types/dashboard.types";
import { useNavigate } from "react-router-dom";
import { useTask } from "./TaskContext";

type ModalStep = "detail" | "tolak" | "ditolak" | "jadwal" | "terkirim" | null;

const getStatusBadge = (status: Pelamar["status_pelamar"]) => {
  const classes: Record<string, string> = {
    diterima: "bg-success-100 text-success-300",
    ditolak: "bg-error-100 text-error",
    menunggu: "bg-neutral-600/25 text-neutral-800",
  };
  return classes[status.toLowerCase()] ?? "";
};

export default function DataLamaranMasuk() {
  const { pelamarList, updateStatusPelamar, addWawancara } = useTask();
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selectedPelamar, setSelectedPelamar] = useState<Pelamar | null>(null);
  const [pesanTolak, setPesanTolak] = useState("");
  const [metodeWawancara, setMetodeWawancara] = useState<
    "Google Meet" | "Tatap Muka"
  >("Google Meet");
  const [tanggalWawancara, setTanggalWawancara] = useState("");
  const [waktuMulaiWawancara, setWaktuMulaiWawancara] = useState("");
  const [waktuSelesaiWawancara, setWaktuSelesaiWawancara] = useState("");
  const [lokasiWawancara, setLokasiWawancara] = useState("");
  const [catatanWawancara, setCatatanWawancara] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const openDetail = (pelamar: Pelamar) => {
    setSelectedPelamar(pelamar);
    setModalStep("detail");
  };

  const closeModal = () => {
    setModalStep(null);
    setSelectedPelamar(null);
    setPesanTolak("");
  };

  const navigate = useNavigate();

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

  const filteredPelamar = pelamarList.filter((p) => {
  const matchStatus = selectedStatus
    ? p.status_pelamar.toLowerCase() === selectedStatus
    : true;
  const matchSearch = searchQuery
    ? p.nama_pelamar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.posisi_lowongan.toLowerCase().includes(searchQuery.toLowerCase())
    : true;
  return matchStatus && matchSearch;
});



  return (
    <DataTaskLayout
      title="Data Pelamar"
      description="Kelola semua pelamar dalam satu tampilan"
      activeTab="lamaranMasuk"
      tabs={tabs}
      statusOptions={["Diterima", "Ditolak", "Menunggu"]}
      onStatusChange={(status) => setSelectedStatus(status)}
      onSearch={(query) => setSearchQuery(query)}
    >
      <div className="w-full px-2 sm:px-6">
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
                  Pendidikan Terakhir
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  No Handphone
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Tanggal Melamar
                </th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPelamar.length > 0 ? (
                filteredPelamar.map((p, index) => (
                  <tr
                    key={p.id}
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
                      {new Date(p.tanggal_melamar).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(p.status_pelamar)}`}
                      >
                        {p.status_pelamar}
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
                  <td colSpan={8} className="text-center py-5 text-neutral-500">
                    Tidak ada data pelamar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalStep && selectedPelamar && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          {/* Modal: Detail Pelamar */}
          {modalStep === "detail" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <IoClose className="text-xl cursor-pointer" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Detail Pelamar</h2>
                  <p className="text-gray-400 text-sm">
                    {selectedPelamar.nama_pelamar} -{" "}
                    {selectedPelamar.posisi_lowongan}
                  </p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-3xl text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">
                      {selectedPelamar.nama_pelamar}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Melamar: {selectedPelamar.posisi_lowongan}
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
                    {selectedPelamar.pendidikan_terakhir_pelamar}
                  </span>
                </div>
                <div className="flex justify-between py-2 mb-4">
                  <span className="text-gray-400 text-sm">No. HP</span>
                  <span className="font-bold text-sm">
                    {selectedPelamar.kontak_pelamar}
                  </span>
                </div>

                <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                  DOKUMEN
                </p>
                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <BsFilePdf className="text-2xl text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        CV_{selectedPelamar.nama_pelamar.replace(" ", "_")}.pdf
                      </p>
                      <p className="text-gray-400 text-xs">
                        PDF . 1.2 MB . Diunggah 12 Mar 2025
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 font-bold text-sm hover:underline">
                    Unduh
                  </button>
                </div>
              </div>
              <hr />
              <div className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => setModalStep("tolak")}
                  className="flex-1 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition cursor-pointer"
                >
                  Tolak Lamaran
                </button>
                <button
                  onClick={() => setModalStep("jadwal")}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition cursor-pointer"
                >
                  Terima Lamaran
                </button>
              </div>
            </div>
          )}

          {/* Modal: Tolak Lamaran */}
          {modalStep === "tolak" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <IoClose className="text-xl cursor-pointer" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Tolak Lamaran</h2>
                  <p className="text-gray-400 text-sm">
                    {selectedPelamar.nama_pelamar} -{" "}
                    {selectedPelamar.posisi_lowongan}
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
                  placeholder="Masukkan 0 - 200 kata"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm h-36 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={() => {
                    (selectedPelamar.id, "Ditolak");
                    setModalStep("ditolak");
                  }}
                  className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition"
                >
                  Konfirmasi Penolakan
                </button>
              </div>
            </div>
          )}

          {/* Modal: Lamaran Ditolak */}
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
                  Lamaran {selectedPelamar.nama_pelamar} untuk posisi{" "}
                  {selectedPelamar.posisi_lowongan} telah ditolak.
                  <br />
                  Notifikasi penolakan telah dikirim ke pelamar
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

          {/* Modal: Jadwal Wawancara */}
          {modalStep === "jadwal" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <IoClose className="text-xl" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">
                    Jadwalkan Wawancara
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {selectedPelamar.nama_pelamar} -{" "}
                    {selectedPelamar.posisi_lowongan}
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
                      className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition ${
                        metodeWawancara === m
                          ? "bg-teal-50 border-teal-400 text-teal-600"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
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
                    placeholder="meet.google.com/abc-xyz"
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
                    placeholder="Siapkan portofolio desain sebelum interview"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button
                  onClick={() => {
                    updateStatusPelamar(selectedPelamar.id, "Diterima");
                    addWawancara({
                      ...selectedPelamar,
                      posisi_lowongan: selectedPelamar.posisi_lowongan ?? "-",
                      pelamar_id: selectedPelamar.id, // ← tambah ini
                      tanggal_wawancara: tanggalWawancara,
                      waktu_mulai_wawancara: waktuMulaiWawancara,
                      waktu_selesai_wawancara: waktuSelesaiWawancara,
                      metode_wawancara: metodeWawancara,
                      tautan_wawancara: lokasiWawancara,
                      note_wawancara: catatanWawancara,
                      status_wawancara: "Wawancara",
                    });
                    setModalStep("terkirim");
                  }}
                  className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
                >
                  Konfirmasi & Kirim Undangan
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

          {/* Modal: Undangan Terkirim */}
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
                  {selectedPelamar.nama_pelamar} telah diundang untuk interview{" "}
                  {tanggalWawancara}, {waktuMulaiWawancara} -{" "}
                  {waktuSelesaiWawancara} via {metodeWawancara}.<br />
                  Notifikasi telah dikirim ke pelamar.
                </p>
                <hr className="w-full mb-4" />
                <div className="text-left w-full">
                  <p className="font-bold text-sm mb-1">Langkah Selanjutnya</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Pelamar akan menerima detail jadwal. Anda bisa memantau
                    status di{" "}
                    <span className="font-bold">Jadwal Wawancara</span> atau
                    melanjutkan percakapan lewat chat
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button
                  onClick={() => navigate("/chat")}
                  className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition"
                >
                  Hubungi Pelamar
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
