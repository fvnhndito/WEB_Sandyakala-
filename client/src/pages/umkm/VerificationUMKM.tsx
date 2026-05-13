import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/features/umkm/components/ui/Card";
import { Button } from "@/shared/components/ui/button";
import {
  FiClock,
  FiCheck,
  FiX,
  FiFileText,
  FiStar,
  FiMessageSquare,
  FiUser,
  FiCalendar,
  FiMail,
  FiUploadCloud,
} from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";

type VerificationStatus =
  | "step1"
  | "step2"
  | "pending"
  | "approved"
  | "rejected";

const steps = [
  { id: 1, name: "Pengisian Data" },
  { id: 2, name: "Upload Dokumen" },
  { id: 3, name: "Menunggu Review" },
  { id: 4, name: "Hasil Verifikasi" },
];

/** Fork & Knife icon (kuliner) */
const ForkKnifeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm8-7h-3v20h3v-8h3V9c0-3.87-3.13-7-7-7z" />
  </svg>
);

export default function VerificationUMKM() {
  const [status, setStatus] = useState<VerificationStatus>("step1");
  const navigate = useNavigate();

  const [kategori, setKategori] = useState("");
  const [customKategori, setCustomKategori] = useState("");

  const getCurrentStep = () => {
    switch (status) {
      case "step1":
        return 1;
      case "step2":
        return 2;
      case "pending":
        return 3;
      case "approved":
        return 4;
      case "rejected":
        return 4;
      default:
        return 1;
    }
  };
  const currentStep = getCurrentStep();

  const getPageTitle = () => {
    if (status === "step1") return "Pengisian Data Akun UMKM";
    if (status === "step2" || status === "pending")
      return "Upload Dokumen Akun UMKM";
    return "Hasil Verifikasi Akun UMKM";
  };
  const pageTitle = getPageTitle();

  /* ─────────────────────── BANNER ─────────────────────── */
  const renderBanner = () => {
    if (status === "step1" || status === "step2") return null;

    switch (status) {
      /* ── PENDING (kuning) ── */
      case "pending":
        return (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative overflow-hidden">
            {/* Clock circle */}
            <div className="w-14 h-14 bg-[#D97706] rounded-full flex items-center justify-center shrink-0 shadow-sm z-10">
              <FiClock className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1 z-10">
              {/* Label */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#D97706] inline-block" />
                <span className="text-[11px] font-extrabold text-[#D97706] tracking-widest uppercase">
                  Sedang Diproses
                </span>
              </div>

              <h2 className="text-[#B45309] text-[20px] font-extrabold mb-2 leading-snug">
                Pengajuan Anda Sedang Ditinjau
              </h2>

              <p className="text-[#92400E] text-[13px] leading-relaxed max-w-3xl mb-4">
                Tim admin FreshStart sedang memeriksa dokumen dan informasi akun
                UMKM Anda. Harap bersabar, proses verifikasi biasanya
                membutuhkan 1–3 hari kerja.
              </p>

              <div className="flex items-center gap-2 text-[#92400E] text-[12px]">
                <FiClock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Diajukan pada: <strong>25 Maret 2025, 12.00 WIB</strong>
                </span>
              </div>
            </div>

            {/* bg deco */}
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-[#FEF08A]/40 to-transparent pointer-events-none" />
          </div>
        );

      /* ── APPROVED (hijau) ── */
      case "approved":
        return (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative overflow-hidden">
            {/* Check circle */}
            <div className="w-14 h-14 bg-[#16A34A] rounded-full flex items-center justify-center shrink-0 shadow-sm z-10">
              <FiCheck className="w-8 h-8 text-white stroke-[3]" />
            </div>

            <div className="flex-1 z-10">
              {/* Label */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block" />
                <span className="text-[11px] font-extrabold text-[#16A34A] tracking-widest uppercase">
                  Terverifikasi
                </span>
              </div>

              <h2 className="text-[#15803D] text-[20px] font-extrabold mb-2 leading-snug">
                Selamat! Akun UMKM Anda Telah Diverifikasi
              </h2>

              <p className="text-[#166534] text-[13px] leading-relaxed max-w-3xl mb-4">
                Akun <strong>Sambal Bakar Nusantara</strong> milik Jane Doe
                telah resmi terverifikasi oleh tim FreshStart. Kini Anda dapat
                mengakses seluruh fitur platform secara penuh, mulai dari
                membuka lowongan kerja, mengelola profil usaha, hingga
                menjangkau lebih banyak kandidat berbakat.
              </p>

              <div className="flex items-center gap-6 text-[#166534] text-[12px] flex-wrap">
                <div className="flex items-center gap-2">
                  <FiClock className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Diverifikasi pada: <strong>31 Maret 2025, 12.30 WIB</strong>
                  </span>
                </div>
                <span>
                  Berlaku: <strong>Seumur Hidup</strong>
                </span>
              </div>
            </div>

            {/* bg deco */}
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-[#BBF7D0]/40 to-transparent pointer-events-none" />
          </div>
        );

      /* ── REJECTED (merah) ── */
      case "rejected":
        return (
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative overflow-hidden">
            {/* X circle */}
            <div className="w-14 h-14 bg-[#FEE2E2] border border-[#FECACA] rounded-full flex items-center justify-center shrink-0 z-10">
              <FiX className="w-7 h-7 text-[#DC2626] stroke-[2.5]" />
            </div>

            <div className="flex-1 z-10">
              {/* Label */}
              <div className="flex items-center gap-1.5 mb-2 bg-[#FEE2E2] w-fit px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] inline-block" />
                <span className="text-[11px] font-extrabold text-[#DC2626] tracking-widest uppercase">
                  Tidak Disetujui
                </span>
              </div>

              <h2 className="text-[#B91C1C] text-[20px] font-extrabold mb-2 mt-1 leading-snug">
                Pengajuan Verifikasi Ditolak
              </h2>

              <p className="text-[#991B1B] text-[13px] leading-relaxed max-w-3xl mb-4">
                Maaf, akun UMKM <strong>Sambal Bakar Nusantara</strong> Anda
                tidak dapat diverifikasi pada saat ini. Admin telah meninjau
                pengajuan Anda dan menemukan beberapa hal yang perlu diperbaiki.
                Silakan baca keterangan di bawah dan ajukan kembali setelah
                melengkapi persyaratan.
              </p>

              <div className="flex items-center gap-2 text-[#991B1B] text-[12px]">
                <FiClock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Ditolak pada: <strong>31 Maret 2025, 12.30 WIB</strong>
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  /* ─────────────────────── CONTENT CARD ─────────────────────── */
  const renderContent = () => {
    switch (status) {
      /* ── STEP 1: Pengisian Data ── */
      case "step1":
        return (
          <div className="mt-6 flex flex-col items-center">
            <Card className="w-full max-w-2xl rounded-2xl shadow-sm border border-gray-200 p-8 bg-white mb-6">
              <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
                Isi Data Usaha
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    Nama Pemilik
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap pemilik usaha"
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    NIB (Nomor Induk Berusaha)
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nomor NIB usaha"
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    Nama Usaha
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama usaha atau UMKM"
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    Kategori Usaha
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="" selected disabled>
                      Pilih Kategori Usaha
                    </option>
                    <option value="Kuliner">Kuliner (Makanan & Minuman)</option>
                    <option value="Fashion & Pakaian">Fashion & Pakaian</option>
                    <option value="Jasa & Layanan">
                      Jasa & Layanan Profesional (Konsultan, Notaris, dll)
                    </option>
                    <option value="Perdagangan/Ritel">
                      Perdagangan/Ritel (Toko kelontong, Minimarket)
                    </option>
                    <option value="Teknologi & Digital">
                      Teknologi & Digital (Startup, Software House)
                    </option>
                    <option value="Kesehatan & Kecantikan">
                      Kesehatan & Kecantikan (Klinik, Salon, Skincare)
                    </option>
                    <option value="Agribisnis">
                      Agribisnis (Pertanian, Peternakan, Perikanan)
                    </option>
                    <option value="Manufaktur & Produksi">
                      Manufaktur & Produksi (Pabrik, Pengolahan Bahan Baku)
                    </option>
                    <option value="Pariwisata & Hiburan">
                      Pariwisata & Hiburan
                    </option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  {kategori === "lainnya" && (
                    <input
                      type="text"
                      placeholder="Tulis kategori usaha"
                      value={customKategori}
                      onChange={(e) => setCustomKategori(e.target.value)}
                      className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    Jumlah Karyawan
                  </label>
                  <select className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option value="" selected disabled>
                      Pilih jumlah karyawan
                    </option>
                    <option value="1 - 10">1 - 10 Karyawan (Usaha Mikro)</option>
                    <option value="11 - 50">
                      11 - 50 Karyawan (Usaha Kecil)
                    </option>
                    <option value="51 - 50">
                      51 - 100 Karyawan (Usaha Menengah)
                    </option>
                    <option value="100+">100+ Karyawan (Usaha Besar)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    Alamat Usaha
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan alamat lengkap lokasi usaha"
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    Email Usaha
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-800">
                    No Telepon Usaha
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
            <Button
              onClick={() => setStatus("step2")}
              className="w-full max-w-2xl bg-[#3B5998] hover:bg-[#2d4373] text-white py-5 rounded-xl font-bold text-[15px]"
            >
              Lanjut
            </Button>
          </div>
        );

      /* ── STEP 2: Upload Dokumen ── */
      case "step2":
        return (
          <div className="mt-6 flex flex-col items-center">
            <Card className="w-full max-w-2xl rounded-2xl shadow-sm border border-gray-200 p-8 bg-white mb-6">
              <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
                Upload Dokumen Usaha
              </h3>
              <div className="flex flex-col gap-6">
                {/* Upload Item 1 */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-gray-800">
                    Upload Logo Usaha
                  </label>
                  <div className="border-[1.5px] border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-xl py-4 flex items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 bg-[#E2E8F0] rounded-full flex items-center justify-center shrink-0">
                      <FiUploadCloud className="w-4.5 h-4.5 text-[#3B5998]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[12px] font-extrabold text-gray-900 leading-tight mb-0.5">
                        Click or drag files to upload
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        PNG, JPG or PDF up to 10MB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload Item 2 */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-gray-800">
                    Upload Foto KTP
                  </label>
                  <div className="border-[1.5px] border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-xl py-4 flex items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 bg-[#E2E8F0] rounded-full flex items-center justify-center shrink-0">
                      <FiUploadCloud className="w-4.5 h-4.5 text-[#3B5998]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[12px] font-extrabold text-gray-900 leading-tight mb-0.5">
                        Click or drag files to upload
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        PNG, JPG or PDF up to 10MB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload Item 3 */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-gray-800">
                    Upload NIB (Nomor Induk Berusaha)
                  </label>
                  <div className="border-[1.5px] border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-xl py-4 flex items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 bg-[#E2E8F0] rounded-full flex items-center justify-center shrink-0">
                      <FiUploadCloud className="w-4.5 h-4.5 text-[#3B5998]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[12px] font-extrabold text-gray-900 leading-tight mb-0.5">
                        Click or drag files to upload
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        PNG, JPG or PDF up to 10MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-5">
              <Button onClick={() => setStatus('step1')} variant="outline" className="flex-1 border-[#3B5998] text-[#3B5998] py-5 rounded-xl font-bold text-[15px] hover:bg-blue-50">
                Kembali
              </Button>
              <Button
                onClick={() => navigate("/umkm/home")}
                className="flex-1 bg-[#3B5998] hover:bg-[#2d4373] text-white py-5 rounded-xl font-bold text-[15px]"
              >
                Lanjut
              </Button>
            </div>
          </div>
        );

      /* ── PENDING: Data Akun yang Diajukan ── */
      case "pending":
        return (
          <Card className="rounded-2xl shadow-sm border border-gray-100 p-8 mt-6 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <FiFileText className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-[17px] font-extrabold text-gray-900">
                Data Akun yang Diajukan
              </h3>
            </div>

            {/* Business card row */}
            <div className="border border-gray-200 rounded-xl p-5 mb-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFEDD5] rounded-full flex items-center justify-center shrink-0">
                  <ForkKnifeIcon className="w-6 h-6 text-[#EA580C]" />
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-gray-900 mb-0.5">
                    Sambal Bakar Nusantara
                  </h4>
                  <p className="text-[12px] text-gray-500 mb-1.5">
                    Kategori: Kuliner
                  </p>
                  <div className="bg-[#F1F5F9] text-[#64748B] text-[10px] px-2 py-0.5 rounded font-medium inline-block border border-gray-200">
                    NIB: 1232131231
                  </div>
                </div>
              </div>

              {/* Status badge */}
              <div className="bg-[#FEF9C3] text-[#CA8A04] px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-[#FDE68A] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]" />
                Menunggu Review
              </div>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12">
              {[
                { label: "Nama Pemilik", value: "Jane Doe" },
                { label: "Email", value: "janedoe@gmail.com" },
                { label: "No Telepon", value: "08123456789" },
                { label: "Jumlah Karyawan", value: "10-50 Karyawan" },
                { label: "Alamat", value: "Jakarta" },
                { label: "Tanggal Bergabung", value: "29 Maret 2025" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-gray-400">{label}</span>
                  <span className="text-[14px] font-bold text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );

      /* ── APPROVED: Fitur yang Bisa Diakses ── */
      case "approved":
        return (
          <Card className="rounded-2xl shadow-sm border border-gray-100 p-8 mt-6 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                <FiStar className="w-4 h-4 text-[#4F46E5] fill-[#4F46E5]" />
              </div>
              <h3 className="text-[17px] font-extrabold text-gray-900">
                Fitur yang Kini Bisa Anda Akses
              </h3>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <FiMessageSquare className="w-5 h-5 text-[#64748B]" />,
                  title: "Buka Lowongan Kerja",
                  desc: "Pasang lowongan dan temukan kandidat terbaik untuk bisnis Anda.",
                },
                {
                  icon: <FiUser className="w-5 h-5 text-[#64748B]" />,
                  title: "Profil UMKM Publik",
                  desc: "Halaman profil usaha Anda tampil di direktori dan dapat dicari pelamar.",
                },
                {
                  icon: (
                    <HiOutlineBadgeCheck className="w-6 h-6 text-[#64748B]" />
                  ),
                  title: "Badge Terverifikasi",
                  desc: "Ikon verifikasi tampil di profil Anda, meningkatkan kepercayaan pelamar.",
                },
                {
                  icon: <FiCalendar className="w-5 h-5 text-[#64748B]" />,
                  title: "Manajemen Pelamar",
                  desc: "Kelola, filter, dan jadwalkan wawancara langsung dari dashboard.",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl p-5 flex gap-4 items-start"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[14px] text-[#1E293B] mb-1">
                      {title}
                    </h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate("/umkm/home")}
              className="w-full bg-[#1E3A5F] hover:bg-[#162d4a] text-white py-3 rounded-lg font-bold text-[15px]"
            >
              Akses Sekarang
            </Button>
          </Card>
        );

      /* ── REJECTED: Pesan dari Admin ── */
      case "rejected":
        return (
          <Card className="rounded-2xl shadow-sm border-2 border-[#1D4ED8] p-8 mt-6 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <FiMail className="w-5 h-5 text-[#DC2626]" />
              <h3 className="text-[17px] font-extrabold text-gray-900">
                Pesan dari Admin
              </h3>
            </div>

            {/* Rejection message box */}
            <div className="border border-[#FECACA] bg-[#FEF2F2] rounded-xl overflow-hidden mb-8">
              {/* Message body */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 text-[#DC2626]">
                  <FiMessageSquare className="w-4 h-4 shrink-0" />
                  <span className="font-extrabold text-[11px] tracking-widest uppercase">
                    Pesan Penolakan
                  </span>
                </div>
                <p className="text-[#334155] text-[13px] leading-relaxed">
                  Setelah kami tinjau, pengajuan verifikasi akun UMKM Anda tidak
                  dapat kami setujui karena dokumen yang diunggah belum memenuhi
                  persyaratan yang berlaku. Foto KTP yang dikirimkan buram dan
                  tidak terbaca dengan jelas, serta SIUP yang Anda lampirkan
                  sudah kadaluarsa sejak Desember 2023. Mohon segera perbaiki
                  dan ajukan kembali dengan dokumen yang valid.
                </p>
              </div>

              {/* Admin footer */}
              <div className="border-t border-[#FECACA] bg-white px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <FiUser className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[13px] text-gray-900">
                      Admin Utama
                    </h5>
                    <p className="text-[11px] text-gray-500">
                      Tim Verifikasi FreshStart
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400">
                  31 Mar 2025. 12.30 WIB
                </span>
              </div>
            </div>

            <Button
              onClick={() => setStatus("step1")}
              className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white py-3 rounded-lg font-bold text-[15px]"
            >
              Ajukan Ulang Verifikasi
            </Button>
          </Card>
        );
    }
  };

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <div className="w-full min-h-screen bg-[#F1F5F9]">
      {/* ── Dev Switcher (floating pill, kecil) untuk status akhir ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-full shadow-xl border border-gray-200">
        <button
          onClick={() => setStatus("pending")}
          title="Sedang Diproses"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            status === "pending"
              ? "bg-[#D97706] shadow-inner"
              : "bg-[#FEF3C7] hover:bg-[#FDE68A]"
          }`}
        >
          <FiClock
            className={`w-3.5 h-3.5 ${status === "pending" ? "text-white" : "text-[#D97706]"}`}
          />
        </button>
        <button
          onClick={() => setStatus("approved")}
          title="Terverifikasi"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            status === "approved"
              ? "bg-[#16A34A] shadow-inner"
              : "bg-[#DCFCE7] hover:bg-[#BBF7D0]"
          }`}
        >
          <FiCheck
            className={`w-3.5 h-3.5 ${status === "approved" ? "text-white" : "text-[#16A34A]"}`}
          />
        </button>
        <button
          onClick={() => setStatus("rejected")}
          title="Tidak Disetujui"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            status === "rejected"
              ? "bg-[#DC2626] shadow-inner"
              : "bg-[#FEE2E2] hover:bg-[#FECACA]"
          }`}
        >
          <FiX
            className={`w-3.5 h-3.5 ${status === "rejected" ? "text-white" : "text-[#DC2626]"}`}
          />
        </button>
      </div>

      {/* ── Page Header ── */}
      <div className="bg-[#E2E8F0] pt-10 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-extrabold text-xl md:text-[24px] text-[#1E293B]">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl -mt-12 pb-24 relative z-10">
        {/* Stepper card */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 md:px-8 py-4 md:py-5 flex justify-between items-center relative overflow-hidden">
          {/* Progress line behind steps */}
          <div className="absolute top-1/2 left-[8%] right-[8%] h-[1.5px] bg-gray-100 -z-0 hidden md:block" />

          {steps.map((s) => {
            const filled = currentStep >= s.id;
            return (
              <div
                key={s.id}
                className="flex flex-col md:flex-row items-center gap-2 md:gap-3 bg-white px-1 md:px-3 z-10"
              >
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[12px] md:text-[13px] font-bold transition-all duration-300 ${
                    filled
                      ? "bg-[#2DD4BF] text-white"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {s.id}
                </div>
                <span
                  className={`text-[11px] md:text-[13px] font-bold hidden sm:block transition-colors duration-300 whitespace-nowrap ${
                    filled ? "text-[#1E293B]" : "text-gray-400"
                  }`}
                >
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic content with fade animation */}
        <div
          key={status}
          className="w-full animate-in fade-in slide-in-from-bottom-3 duration-400"
        >
          {renderBanner()}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
