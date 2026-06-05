import { useState, useEffect } from "react";
import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import { apiRequest } from "@/shared/lib/api";

interface Job {
  id: number;
  title: string;
  type: string;
  deadline: string;
  created_at: string;
  worker_needed: number;
  salary_min?: number;
  salary_max?: number;
}

type ModalStep = "edit" | "batalEdit" | "simpanBerhasil" | "konfirmasiHapus" | "batalHapus" | "hapusBerhasil" | null;

const tabs = [
  { label: "Lamaran Masuk", path: "/umkm/dashboard/lamaran-masuk", key: "lamaranMasuk" },
  { label: "Dalam Seleksi", path: "/umkm/dashboard/dalam-seleksi", key: "dalamSeleksi" },
  { label: "Posisi Terbuka", path: "/umkm/dashboard/posisi-terbuka", key: "posisiTerbuka" },
];

const isJobOpen = (deadline: string) => new Date(deadline) >= new Date();

export default function DataPosisiTerbuka() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selected, setSelected] = useState<Job | null>(null);

  // State edit
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    const res = await apiRequest<any>("/jobs/umkm/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.success && res.data) {
      setJobs((res.data as any) ?? []);
    } else {
      setError(res.message || "Gagal mengambil data lowongan");
    }
    setLoading(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const status = isJobOpen(job.deadline) ? "buka" : "tutup";
    const matchStatus = selectedStatus ? status === selectedStatus.toLowerCase() : true;
    const matchSearch = searchQuery
      ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  const openEdit = (job: Job) => {
    setSelected(job);
    setEditTitle(job.title);
    setEditDeadline(job.deadline?.slice(0, 10) ?? "");
    setModalStep("edit");
  };

  const openHapus = (job: Job) => {
    setSelected(job);
    setModalStep("konfirmasiHapus");
  };

  const closeModal = () => { setModalStep(null); setSelected(null); };

  const handleSimpan = async () => {
    if (!selected) return;

    const detailRes = await apiRequest<any>(`/jobs/${selected.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!detailRes.success || !detailRes.data) return;

    const job = detailRes.data;
    const body: any = {
      title: editTitle,
      job_category: job.job_category,
      description: job.description,
      type: job.type,
      salary_min: job.salary_min ?? undefined,
      salary_max: job.salary_max ?? undefined,
      worker_needed: job.worker_needed,
      minimum_education: job.minimum_education,
      qualification_description: job.qualification_description,
      portfolio_requirement: job.portfolio_requirement,
      deadline: editDeadline,
      skills: (job.skills ?? []).map((s: any) => s.skill_name ?? s),
    };

    if (job.type === "SHIFT" && job.shifts) body.shifts = job.shifts;
    if (job.type === "PROJECT" && job.project_tasks) body.project_tasks = job.project_tasks;

    const res = await apiRequest(`/jobs/${selected.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    if (res.success) {
      await fetchJobs();
      setModalStep("simpanBerhasil");
    }
  };

  const handleHapus = async () => {
    if (!selected) return;
    const res = await apiRequest(`/jobs/${selected.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.success) {
      await fetchJobs();
      setModalStep("hapusBerhasil");
    }
  };

  return (
    <DataTaskLayout
      title="Data Lowongan"
      description="Kelola semua lowongan dalam satu tampilan"
      activeTab="posisiTerbuka"
      tabs={tabs}
      statusOptions={["Buka", "Tutup"]}
      onStatusChange={setSelectedStatus}
      onSearch={setSearchQuery}
    >
      <div className="w-full px-2 sm:px-6">
        {loading ? (
          <p className="text-center py-10 text-neutral-500">Memuat data...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : (
          <div className="border border-neutral-200 rounded-lg overflow-x-auto">
            <table className="w-full min-w-fit table-auto border-collapse text-sm text-neutral-900">
              <thead>
                <tr className="bg-mint/15 text-center">
                  <th className="border px-3 py-2 text-xs">No</th>
                  <th className="border px-3 py-2 text-xs">Posisi</th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">Tipe Kerja</th>
                  <th className="border px-3 py-2 text-xs whitespace-nowrap">Deadline</th>
                  <th className="border px-3 py-2 text-xs">Kuota</th>
                  <th className="border px-3 py-2 text-xs">Status</th>
                  <th className="border px-3 py-2 text-xs">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <tr key={job.id} className="hover:bg-neutral-100 transition text-center text-xs">
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2 font-semibold">{job.title}</td>
                      <td className="border px-3 py-2">{job.type === "PROJECT" ? "Berbasis Proyek" : "Shift Harian"}</td>
                      <td className="border px-3 py-2 whitespace-nowrap">
                        {new Date(job.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </td>
                      <td className="border px-3 py-2">{job.worker_needed} orang</td>
                      <td className="border px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isJobOpen(job.deadline) ? "bg-success-100 text-success" : "bg-error-100 text-error"}`}>
                          {isJobOpen(job.deadline) ? "Buka" : "Tutup"}
                        </span>
                      </td>
                      <td className="border px-3 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(job)} className="text-yellow-500 hover:text-yellow-600">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => openHapus(job)} className="text-red-500 hover:text-red-600">
                            <RiDeleteBin6Line className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-neutral-500">Tidak ada data lowongan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODALS ───────────────────────────────────────────────────────────── */}
      {modalStep && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

          {modalStep === "edit" && selected && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 flex items-center gap-3">
                <button onClick={() => setModalStep("batalEdit")} className="text-gray-600 hover:text-gray-900">
                  <GoArrowLeft className="text-xl" />
                </button>
                <div>
                  <h2 className="font-extrabold text-lg">Edit Lowongan</h2>
                  <p className="text-gray-400 text-sm">Perbarui informasi posisi yang tersedia</p>
                </div>
              </div>
              <hr />
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Judul Lowongan</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Deadline</label>
                  <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
                </div>
              </div>
              <hr />
              <div className="px-6 py-4 flex gap-3">
                <button onClick={() => setModalStep("batalEdit")} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50">Batal</button>
                <button onClick={handleSimpan} className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800">Simpan Perubahan</button>
              </div>
            </div>
          )}

          {modalStep === "batalEdit" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <h2 className="font-extrabold text-xl mb-3">Perubahan tidak tersimpan</h2>
              <p className="text-gray-400 text-sm mb-8">Lakukan simpan ulang jika ingin menyimpan perubahan</p>
              <button onClick={closeModal} className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800">Tutup</button>
            </div>
          )}

          {modalStep === "simpanBerhasil" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-4">
                <IoCheckmark className="text-2xl text-white" />
              </div>
              <h2 className="font-extrabold text-xl mb-3">Lowongan berhasil diperbarui</h2>
              <button onClick={closeModal} className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800">Lihat Lowongan</button>
            </div>
          )}

          {modalStep === "konfirmasiHapus" && selected && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <h2 className="font-extrabold text-xl mb-3">Yakin ingin menghapus lowongan?</h2>
              <p className="text-gray-400 text-sm mb-8">Lowongan akan dihapus permanen dan tidak bisa dipulihkan</p>
              <div className="flex gap-3">
                <button onClick={() => setModalStep("batalHapus")} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50">Tidak</button>
                <button onClick={handleHapus} className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800">Ya, Hapus</button>
              </div>
            </div>
          )}

          {modalStep === "batalHapus" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <IoClose className="text-2xl text-gray-500" />
              </div>
              <h2 className="font-extrabold text-xl mb-3">Lowongan tidak dihapus</h2>
              <p className="text-gray-400 text-sm mb-8">Lowongan tetap tersedia dan dapat dikelola kembali</p>
              <button onClick={closeModal} className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800">Kembali</button>
            </div>
          )}

          {modalStep === "hapusBerhasil" && (
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl px-8 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-4">
                <IoCheckmark className="text-2xl text-white" />
              </div>
              <h2 className="font-extrabold text-xl mb-3">Lowongan berhasil dihapus</h2>
              <p className="text-gray-400 text-sm mb-8">Lowongan telah dihapus secara permanen</p>
              <button onClick={closeModal} className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-800">Lihat Lowongan</button>
            </div>
          )}

        </div>
      )}
    </DataTaskLayout>
  );
}
