import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsPersonCheck, BsShieldCheck } from "react-icons/bs";
import { MdOutlineTrackChanges, MdOutlineLayersClear } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiUserPlus } from "react-icons/fi";
import logo from "@/assets/images/logo.png";
import { useAppSelector } from "@/shared/stores/hook";

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
        "aplikasi",
      ];

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            setActive(sectionIds[i]);
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
      style={{ backgroundImage: "url('/src/assets/images/hero-landing.png')" }}
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
              className="min-w-[280px] max-w-[280px] bg-teal-50 rounded-xl p-5 shrink-0"
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
            src="/src/assets/images/kolaborasi.png"
            alt="Kolaborasi"
            className="w-52 md:w-64 object-contain shrink-0 hidden md:block"
          />
        </div>
      </div>
    </section>
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
    </div>
  );
}
