import { useState } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import type { Lowongan } from "@/features/umkm/types/dashboard.types";
import { getLowonganWithCount } from "@/features/umkm/utils/rekrutmen-join";

type ModalStep =
  | "edit"
  | "batalEdit"
  | "simpanBerhasil"
  | "konfirmasiHapus"
  | "batalHapus"
  | "hapusBerhasil"
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

const getStatusBadge = (status: Lowongan["status_lowongan"]) => {
  return status === "Buka"
    ? "bg-success-100 text-success"
    : "bg-error-100 text-error";
};

export default function DataPosisiTerbuka() {
  const [dataLowongan, setDataLowongan] = useState(getLowonganWithCount());

  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selected, setSelected] = useState<Lowongan | null>(null);

  const [namaPosisiLowongan, setNamaPosisiLowongan] = useState("");
  const [tipeKerjaLowongan, setTipeKerjaLowongan] = useState("Berbasis Proyek");
  const [tanggalBukaLowongan, setTanggalBukaLowongan] = useState("");
  const [tanggalTutupLowongan, setTanggalTutupLowongan] = useState("");
  const [statusLowongan, setStatusLowongan] = useState<"Buka" | "Tutup" | "Segera Tutup">(
    "Buka",
  );
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLowongan = dataLowongan.filter((item) => {
  const matchStatus = selectedStatus
    ? item.status_lowongan.toLowerCase() === selectedStatus
    : true;
  const matchSearch = searchQuery
    ? item.posisi_lowongan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tipe_lowongan.toLowerCase().includes(searchQuery.toLowerCase())
    : true;
  return matchStatus && matchSearch;
});

  const openEdit = (item: Lowongan) => {
    setSelected(item);
    setNamaPosisiLowongan(item.posisi_lowongan);
    setTipeKerjaLowongan(item.tipe_lowongan);
    setStatusLowongan(item.status_lowongan);
    setTanggalBukaLowongan(item.tanggal_buka_lowongan);
    setTanggalTutupLowongan(item.tanggal_tutup_lowongan);
    setModalStep("edit");
  };

  const openHapus = (item: Lowongan) => {
    setSelected(item);
    setModalStep("konfirmasiHapus");
  };

  const closeModal = () => {
    setModalStep(null);
    setSelected(null);
  };

  // edit
  const handleSimpan = () => {
    if (!selected) return;
    setDataLowongan((prev) =>
      prev.map((l) =>
        l.id === selected.id
          ? {
              ...l,
              posisi_lowongan: namaPosisiLowongan,
              tipe_lowongan: tipeKerjaLowongan,
              tanggal_buka_lowongan: tanggalBukaLowongan,
              tanggal_tutup_lowongan: tanggalTutupLowongan,
              status_lowongan: statusLowongan,
            }
          : l,
      ),
    );
    setModalStep("simpanBerhasil");
  };

  // delete
  const handleHapus = () => {
    if (!selected) return;
    setDataLowongan((prev) => prev.filter((l) => l.id !== selected.id));
    setModalStep("hapusBerhasil");
  };

  return (
    <DataTaskLayout
      title="Data Lowongan"
      description="Kelola semua lowongan dalam satu tampilan"
      activeTab="posisiTerbuka"
      tabs={tabs}
      statusOptions={["Buka", "Tutup", "Segera Tutup"]}
      onStatusChange={(status) => setSelectedStatus(status)}
      onSearch={(query) => setSearchQuery(query)}
    >
      <div className="w-full px-2 sm:px-6">
        <div className=" border border-neutral-200 rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full min-w-fit table-auto border-collapse text-sm text-neutral-900">
            <thead>
              <tr className="bg-mint/15 text-center">
                <th className="border px-3 py-2">No</th>
                <th className="border px-3 py-2">Posisi</th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Tipe Kerja
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Tanggal Buka Lowongan
                </th>
                <th className="border px-3 py-2">Pelamar</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLowongan.length > 0 ? (
                filteredLowongan.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-100 transition text-center text-xs"
                  >
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2 font-semibold">
                      {item.posisi_lowongan}
                    </td>
                    <td className="border px-3 py-2">{item.tipe_lowongan}</td>
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {new Date(item.tanggal_buka_lowongan).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}{" "}
                      -{" "}
                      {new Date(item.tanggal_tutup_lowongan).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="border px-3 py-2">
                      {item.jumlah_pelamar ?? 0} Pelamar
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status_lowongan)}`}
                      >
                        {item.status_lowongan}
                      </span>
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="text-yellow-500 hover:text-yellow-600 transition"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openHapus(item)}
                          className="text-red-500 hover:text-red-600 transition"
                        >
                          <RiDeleteBin6Line className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-neutral-500">
                    Tidak ada data lowongan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalStep && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          {/* Modal: Edit Lowongan */}
          {modalStep === "edit" && selected && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setModalStep("batalEdit")}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <GoArrowLeft className="text-xl" />
                  </button>
                  <div>
                    <h2 className="font-extrabold text-lg">Edit Lowongan</h2>
                    <p className="text-gray-400 text-sm">
                      Perbarui informasi posisi yang tersedia
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(statusLowongan)}`}
                >
                  {statusLowongan}
                </span>
              </div>
              <hr />
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Nama Posisi
                  </label>
                  <input
                    type="text"
                    value={namaPosisiLowongan}
                    onChange={(e) => setNamaPosisiLowongan(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Tipe Kerja
                  </label>
                  <select
                    value={tipeKerjaLowongan}
                    onChange={(e) => setTipeKerjaLowongan(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    <option>Berbasis Proyek</option>
                    <option>Berbasis Shift</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm text-gray-700 mb-1 block">
                      Tanggal Buka
                    </label>
                    <input
                      type="date"
                      value={tanggalBukaLowongan}
                      onChange={(e) => setTanggalBukaLowongan(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-700 mb-1 block">
                      Tanggal Tutup
                    </label>
                    <input
                      type="date"
                      value={tanggalTutupLowongan}
                      onChange={(e) => setTanggalTutupLowongan(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Jumlah Pelamar
                  </label>
                  <input
                    type="number"
                    value={selected.jumlah_pelamar ?? 0}
                    readOnly
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Otomatis dihitung dari data pelamar masuk
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Status Lowongan
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStatusLowongan("Tutup")}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                        statusLowongan === "Tutup"
                          ? "bg-error-100 border-error-300 text-error-300"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Tutup Lowongan
                    </button>
                    <button
                      onClick={() => setStatusLowongan("Buka")}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                        statusLowongan === "Buka"
                          ? "bg-success-100 border-success-300 text-success-300"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Buka Lowongan
                    </button>
                  </div>
                </div>
              </div>
              <hr />
              <div className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => setModalStep("batalEdit")}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSimpan}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* Modal: Batal Edit */}
          {modalStep === "batalEdit" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <h2 className="font-extrabold text-xl mb-3">
                Perubahan Anda tidak tersimpan
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Silakan lakukan simpan ulang jika ingin menyimpan
              </p>
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
              >
                Lihat Lowongan Lainnya
              </button>
            </div>
          )}

          {/* Modal: Simpan Berhasil */}
          {modalStep === "simpanBerhasil" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <h2 className="font-extrabold text-xl mb-3">
                Update lowongan berhasil dilakukan
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Silakan lanjutkan melihat lowongan lainnya.
              </p>
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
              >
                Lihat Lowongan Lainnya
              </button>
            </div>
          )}

          {/* Modal: Konfirmasi Hapus */}
          {modalStep === "konfirmasiHapus" && selected && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <h2 className="font-extrabold text-xl mb-3">
                Yakin ingin menghapus lowongan?
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Lowongan ini akan dihapus permanen dan tidak bisa dipulihkan
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalStep("batalHapus")}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Tidak
                </button>
                <button
                  onClick={handleHapus}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
                >
                  Ya
                </button>
              </div>
            </div>
          )}

          {/* Modal: Batal Hapus */}
          {modalStep === "batalHapus" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <IoClose className="text-2xl text-gray-500" />
              </div>
              <h2 className="font-extrabold text-xl mb-3">
                Lowongan tidak dihapus
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Lowongan tetap tersedia dan dapat dikelola kembali.
              </p>
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
              >
                Lihat Lowongan Lainnya
              </button>
            </div>
          )}

          {/* Modal: Hapus Berhasil */}
          {modalStep === "hapusBerhasil" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-4">
                <IoCheckmark className="text-2xl text-white" />
              </div>
              <h2 className="font-extrabold text-xl mb-3">
                Lowongan berhasil dihapus
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Lowongan telah dihapus secara permanen dari sistem.
              </p>
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
              >
                Lihat Lowongan Lainnya
              </button>
            </div>
          )}
        </div>
      )}
    </DataTaskLayout>
  );
}
