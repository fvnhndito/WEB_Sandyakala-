import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsPersonCheck, BsShieldCheck } from "react-icons/bs";
import { MdOutlineTrackChanges, MdOutlineLayersClear } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiUserPlus } from "react-icons/fi";
import logo from "@/assets/images/logo.png";
import { useAppSelector } from "@/shared/stores/hook";
import AppFs from "@/assets/images/app-fs.png";
import heroLanding from "@/assets/images/hero-landing.png";
import kolaborasi from "@/assets/images/kolaborasi.png";

const navigateToDashboard = (role: string) => {
  if (role === "UMKM") {
    return "/umkm/home";
  } else if (role === "ADMIN") {
    return "/admin/dashboard";
  } else if (role === "USER") {
    return "/umkm/verification";
  } else {
    return "/auth/register";
  }
};

function LandingNavbar() {
  const [active, setActive] = useState("beranda");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { role } = useAppSelector((state) => state.auth);

  useEffect(() => {
  const onScroll = () => {
    setScrolled(window.scrollY > 20);

    const sectionIds = [
      "beranda",
      "cara-kerja",
      "keunggulan",
      "testimoni",
      "faq",
      "aplikasi",
    ];

    for (const id of sectionIds) {
      const el = document.getElementById(id);

      if (el) {
        const rect = el.getBoundingClientRect();

        if (rect.top <= 150 && rect.bottom >= 150) {
          setActive(id);
          break;
        }
      }
    }
  };

  window.addEventListener("scroll", onScroll);

  return () => window.removeEventListener("scroll", onScroll);
}, []);

  const scrollTo = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "beranda", label: "Beranda" },
    { id: "cara-kerja", label: "Cara Kerja" },
    { id: "keunggulan", label: "Keunggulan" },
    { id: "testimoni", label: "Testimoni" },
    { id: "faq", label: "FAQ" },
    { id: "aplikasi", label: "Aplikasi" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""} bg-white`}
    >
      <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">
        {/* LOGO */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => scrollTo("beranda")}
        >
          <img
            src={logo}
            alt="FreshStart"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* NAV LINKS — desktop only */}
        <ul className="hidden lg:flex items-center gap-8 font-bold">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollTo(link.id)}
                className={`text-sm font-bold transition-colors duration-200 pb-1 ${
                  active === link.id
                    ? "text-teal-400 underline decoration-4 underline-offset-8"
                    : "text-primary-dark hover:text-teal-400"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* BUTTON — desktop only */}
        <button
          onClick={() => navigate(navigateToDashboard(role))}
          className="hidden lg:block border-2 border-blue-600 text-blue-600 font-semibold text-sm px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200"
        >
          {role ? "Dashboard" : "Mulai Kolaborasi"}
        </button>

        {/* HAMBURGER — mobile only */}
        <button
          className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-4 shadow-md">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-sm font-bold text-left transition-colors duration-200 ${
                active === link.id
                  ? "text-teal-400"
                  : "text-primary-dark hover:text-teal-400"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate(navigateToDashboard(role));
            }}
            className="mt-2 border-2 border-blue-600 text-blue-600 font-semibold text-sm px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 w-fit"
          >
            {role ? "Dashboard" : "Mulai Kolaborasi"}
          </button>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const { role } = useAppSelector((state) => state.auth);

  return (
    <section
      id="beranda"
      className="relative min-h-screen bg-cover bg-center flex items-center pt-20"
      style={{ backgroundImage: `url(${heroLanding})` }}
    >
      <div className="absolute inset-0 bg-blue-900/60" />
      <div className="relative z-10 max-w-6xl mx-auto px-28 w-full">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Usahamu Butuh Bantuan?
            <br className="hidden md:block" />
            Kami Punya Talentnya.
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-8 leading-relaxed">
            Mulai dari efisiensi operasional, hingga memberi kesempatan kerja
            bagi lulusan baru di Indonesia!
          </p>
          <button
            onClick={() => navigate(navigateToDashboard(role))}
            className="bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-full shadow-lg hover:bg-green-50 transition-all duration-200 text-sm md:text-base"
          >
            {role ? "Dashboard" : "Mulai Kolaborasi"}
          </button>
        </div>
      </div>
    </section>
  );
}

function CaraKerjaSection() {
  const steps = [
    { Icon: FiUserPlus, title: "Daftar & Buat akun usaha" },
    { Icon: BsPersonCheck, title: "Posting & Rekrut pekerja yang sesuai" },
    {
      Icon: HiOutlineLightningBolt,
      title: "Usaha berkembang efisien & efektif",
    },
  ];

  return (
    <section id="cara-kerja" className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-28">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-10">
          Proses ringkas, Usaha makin lancar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex items-center gap-4 border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-teal-50 rounded-lg p-2.5 shrink-0">
                <step.Icon className="w-6 h-6 text-teal-500" />
              </div>
              <p className="font-semibold text-sm text-gray-800">
                {step.title}
              </p>
            </div>
          ))}
        </div>

        <div className="relative border border-gray-200 rounded-xl px-8 py-7 shadow-sm overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 border border-gray-300 rounded-full text-xs font-semibold px-3 py-1 mb-4 text-gray-600">
              <HiOutlineLightningBolt className="w-3.5 h-3.5 text-teal-500" />
              Fast track import
            </span>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              Sudah punya akun usaha diplatform lain?
            </h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Kamu bisa menghubungkan akun dari beberapa platform lain kesini
              (cth. Instagram, Facebook, Whatsapp Business)
            </p>
            <button className="text-blue-600 font-semibold text-sm underline underline-offset-2 hover:text-blue-800 transition-colors">
              Pelajari selengkapnya
            </button>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <MdOutlineLayersClear className="w-32 h-32 text-teal-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

function KeunggulanSection() {
  const features = [
    {
      Icon: MdOutlineTrackChanges,
      title: "Task Track — Progres Transparan",
      desc: "Setiap tugas bisa dipantau statusnya secara real-time: dikumpulkan, direview, disetujui, atau direvisi. Kamu tidak perlu menebak-nebak sudah sampai mana pekerjaan talent.",
    },
    {
      Icon: BsPersonCheck,
      title: "Talent Berkualitas, Siap Berkarya",
      desc: "Semua talent di FreshStart adalah fresh graduate terverifikasi yang termotivasi membangun portofolio nyata. Mereka antusias, adaptif, dan siap berkontribusi penuh untuk usahamu.",
    },
    {
      Icon: MdOutlineLayersClear,
      title: "Proyek & Shift — Satu Platform",
      desc: "Butuh desainer untuk proyek sebulan? Atau koki harian untuk warungmu? FreshStart menangani keduanya. Tidak perlu platform berbeda untuk kebutuhan yang berbeda.",
    },
    {
      Icon: BsShieldCheck,
      title: "Aman & Terpercaya",
      desc: "Setiap kolaborasi terdokumentasi dengan baik — mulai dari proses lamaran, perjanjian kerja, hingga histori tugasnya. Tidak ada yang bisa disangkal, semua transparan dan bisa diakses kapan saja.",
    },
  ];

  return (
    <section id="keunggulan" className="py-14 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-28">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-10">
          Kenapa UMKM pilih FreshStart?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-xl px-7 py-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-teal-50 rounded-lg p-2.5 shrink-0 mt-0.5">
                  <f.Icon className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {f.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatistikSection() {
  const stats = [
    { value: "1.200", suffix: "+", label: "UMKM aktif terdaftar" },
    { value: "5.000", suffix: "+", label: "Talent siap bekerja" },
    { value: "8.400", suffix: "+", label: "Proyek selesai" },
    { value: "94", suffix: "%", label: "UMKM puas & kembali lagi" },
  ];

  return (
    <section id="statistik" className="bg-slate-700 py-14 px-8">
      <div className="max-w-6xl mx-auto px-28">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          Ribuan usaha sudah merasakan manfaatnya
        </h2>
        <p className="text-slate-300 text-sm mb-10 max-w-md">
          FreshStart tumbuh bersama ekosistem UMKM dan talenta muda Indonesia
          setiap harinya.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`${i < 3 ? "border-r border-slate-500 pr-6" : ""}`}
            >
              <p className="text-3xl md:text-4xl font-extrabold text-white">
                {s.value}
                <span className="text-green-400 ml-1">{s.suffix}</span>
              </p>
              <p className="text-slate-400 text-xs mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimoniSection() {
  const testimoni = [
    {
      nama: "Pak Andi Setiawan",
      usaha: "Batik Sari Nusantara · Fashion, Solo",
      bintang: 5,
      pesan:
        "Task Track-nya sangat membantu. Saya bisa lihat progress desainer saya kapan saja, bahkan saat sedang di toko. Tidak perlu WhatsApp bolak-balik lagi. Kerja jadi lebih tenang dan efisien.",
      inisial: "PA",
    },
    {
      nama: "Pak Budi Santoso",
      usaha: "Warung Pak Budi · Kuliner, Surabaya",
      bintang: 4,
      pesan:
        "Warung saya butuh koki harian tapi tidak mau ribet rekrut karyawan tetap. FreshStart punya sistem shift yang simpel — tinggal konfirmasi kehadiran setiap hari. Sangat pas untuk usaha kecil seperti saya.",
      inisial: "PB",
    },
    {
      nama: "Bu Hana Wijaya",
      usaha: "Kue Hana · Kuliner, Surabaya",
      bintang: 5,
      pesan:
        "Saya kira susah cari orang yang mau bantu redesign website dengan harga yang masuk akal. Ternyata lewat FreshStart, dalam 3 hari sudah ada 5 lamaran masuk. Hasilnya pun melampaui ekspektasi saya.",
      inisial: "BH",
    },
    {
      nama: "Pak Andi",
      usaha: "Batik Sari Nusantara · Fashion, Solo",
      bintang: 5,
      pesan:
        "Task Track-nya sangat membantu. Saya bisa lihat progress desainer saya kapan saja, bahkan saat sedang di toko. Tidak perlu WhatsApp bolak-balik lagi. Kerja jadi lebih tenang.",
      inisial: "PA",
    },
  ];

  return (
    <section id="testimoni" className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-28">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-2">
          Kata mereka yang sudah berkolaborasi
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          Ini pengalaman nyata dari UMKM yang sudah bergabung
        </p>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {testimoni.map((t, i) => (
            <div
              key={i}
              className="min-w-280px max-w-280px bg-teal-50 rounded-xl p-5 shrink-0"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span
                    key={j}
                    className={`text-sm ${j < t.bintang ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">
                "{t.pesan}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.inisial}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.nama}</p>
                  <p className="text-gray-400 text-xs">{t.usaha}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-28">
        <div className="border border-gray-200 rounded-2xl px-10 py-10 flex items-center justify-between gap-8 overflow-hidden">
          <div className="max-w-sm">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-3 leading-snug">
              Yuk mulai berkolaborasi, <br />
              dan kembangkan usahamu!
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Kolaborasi antara UMKM & talenta muda untuk menciptakan
              pertumbuhan bagi bisnis dan Indonesia, dimulai hari ini
            </p>
            <button
              onClick={() => navigate("/auth/register")}
              className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Daftarkan usahaku sekarang
            </button>
          </div>
          <img
            src={kolaborasi}
            alt="Kolaborasi"
            className="w-52 md:w-64 object-contain shrink-0 hidden md:block"
          />
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question:
        "Apa itu FreshStart dan bagaimana platform ini membantu bisnis saya?",
      answer:
        "FreshStart adalah platform kolaborasi yang menghubungkan UMKM dengan fresh graduate berbakat. Platform kami membantu bisnis Anda menemukan talenta muda yang termotivasi untuk mengerjakan proyek atau shift harian, sehingga operasional usaha Anda menjadi lebih efisien dan efektif.",
    },
    {
      question:
        "Bagaimana sistem verifikasi FreshStart menjamin keamanan lowongan saya?",
      answer:
        "Setiap UMKM yang mendaftar melewati proses verifikasi identitas dan legalitas usaha. Talent juga diverifikasi melalui dokumen pendidikan dan portofolio. Seluruh proses kolaborasi didokumentasikan di platform, sehingga tidak ada yang bisa disangkal dan semua pihak terlindungi.",
    },
    {
      question: "Apa keuntungan bagi UMKM setelah lolos tahap verifikasi?",
      answer:
        "Setelah terverifikasi, Anda bisa langsung posting lowongan proyek atau shift, mengakses ribuan talent siap kerja, menggunakan fitur Task Track untuk memantau progres secara real-time, serta mendapatkan histori kolaborasi lengkap yang terdokumentasi rapi di satu platform.",
    },
    {
      question:
        "Apakah saya bisa memantau pekerjaan yang sedang berlangsung secara transparan?",
      answer:
        "Ya! Fitur Task Track kami memungkinkan Anda memantau status setiap tugas secara real-time — mulai dari dikumpulkan, direview, disetujui, hingga direvisi. Anda tidak perlu lagi menghubungi talent lewat WhatsApp untuk sekadar menanyakan update pekerjaan.",
    },
    {
      question:
        "Bagaimana jika saya ingin berkomunikasi lebih lanjut dengan pelamar?",
      answer:
        "FreshStart menyediakan fitur pesan terintegrasi di dalam platform. Anda bisa langsung berdiskusi dengan calon talent, memberikan brief proyek, atau memberikan feedback revisi — semuanya tercatat dan dapat diakses kapan saja tanpa perlu aplikasi chat pihak ketiga.",
    },
    {
      question:
        "Mengapa FreshStart lebih baik dibanding platform rekrutmen konvensional untuk UMKM?",
      answer:
        "Platform konvensional umumnya dirancang untuk perusahaan besar dengan proses panjang dan mahal. FreshStart fokus pada kebutuhan UMKM: fleksibel (proyek atau shift), talent terverifikasi yang antusias membangun portofolio, biaya terjangkau, dan proses yang ringkas sehingga Anda bisa langsung kolaborasi tanpa hambatan birokrasi.",
    },
  ];

  return (
    <section id="faq" className="py-14 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-28">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-10">
          Pertanyaan yang sering diajukan
        </h2>

        <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden bg-white">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <rect
              x="5"
              y="2"
              width="14"
              height="20"
              rx="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
          Download <span className="text-blue-600">FreshStart</span> di HP kamu
        </h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Aplikasi mobile FreshStart tersedia di Google Play Store. Unduh
          sekarang dan mulai perjalanan kariermu!
        </p>

        {/* Steps */}
        <ol className="flex flex-col gap-3 mb-7">
          {[
            "Buka Google Play Store di HP Android-mu",
            "Install aplikasi FreshStart secara gratis",
            "Buat akun pelamar dan langsung cari lowongan",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700">{step}</span>
            </li>
          ))}
        </ol>

        {/* Download button */}
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-xl px-5 py-3 hover:bg-gray-50 transition-colors"
        >
          {/* Play Store icon */}
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M3 20.5V3.5L13.5 12 3 20.5Z" fill="#EA4335" />
            <path
              d="M3 3.5L13.5 12l3-2.93L5.15 2.6A1.5 1.5 0 003 3.5Z"
              fill="#FBBC05"
            />
            <path
              d="M3 20.5a1.5 1.5 0 002.15.9L16.5 14.93 13.5 12 3 20.5Z"
              fill="#34A853"
            />
            <path
              d="M16.5 14.93l3.02-1.8a1.5 1.5 0 000-2.26l-3.02-1.8L13.5 12l3 2.93Z"
              fill="#4285F4"
            />
          </svg>
          <div className="text-left">
            <p className="text-10px text-gray-500 leading-none">
              Download di
            </p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              Google Play
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}

function AplikasiSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <DownloadModal onClose={() => setShowModal(false)} />}

      <section id="aplikasi" className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-28">
          <div className="border border-gray-200 rounded-2xl px-10 py-10 flex items-center justify-between gap-8 overflow-hidden">
            {/* Text side */}
            <div className="max-w-sm">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
                Cari kerja lebih mudah di{" "}
                <span className="text-teal-500">genggaman tanganmu</span>
              </h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Khusus untuk para pencari kerja dan talenta muda Indonesia.
                Download aplikasi FreshStart dan mulai lamar pekerjaan dari mana
                saja, kapan saja.
              </p>

              <ul className="flex flex-col gap-2 mb-6">
                {[
                  "Lihat lowongan dari UMKM terverifikasi",
                  "Lamar & pantau status lamaran real-time",
                  "Gratis 100% untuk pelamar",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <svg
                      className="w-4 h-4 text-teal-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                Download Aplikasi
              </button>
            </div>

            {/* Phone mockup side */}
            <div className="hidden md:flex items-center justify-center w-52 shrink-0">
              <img
                src={AppFs}
                alt="Aplikasi FreshStart"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function LandingPage() {
  return (
    <div className="font-sans">
      <LandingNavbar />
      <HeroSection />
      <CaraKerjaSection />
      <KeunggulanSection />
      <StatistikSection />
      <TestimoniSection />
      <CTASection />
      <FaqSection />
      <AplikasiSection />
    </div>
  );
}
