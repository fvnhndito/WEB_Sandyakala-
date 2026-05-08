import { RiUserSearchFill } from "react-icons/ri";
import type {
  BenefitItem,
  ContactItem,
  JobOpening,
  Pelamar,
  Project,
  Shift,
  StatCard,
  StatCardDataType,
  TabsData,
  TaskListType,
  TestimonialItem,
  Wawancara,
} from "../types/dashboard.types";
import { FaUserClock, FaUserPlus } from "react-icons/fa6";
import { BiSolidNotepad } from "react-icons/bi";

export const lamaranTerbaru = [
  {
    id: 1,
    name: "Kathryn Murphy",
    role: "Medical Assistant",
    status: "Cek",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Ralph Edwards",
    role: "President of Sales",
    status: "Wawancara",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "Devon Lane",
    role: "Nursing Assistant",
    status: "Tidak Lolos",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: 4,
    name: "Marvin McKinney",
    role: "Dog Trainer",
    status: "Lolos",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: 5,
    name: "Dianne Russell",
    role: "Web Designer",
    status: "Lolos",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: 6,
    name: "Savannah Nguyen",
    role: "President of Sales",
    status: "Tidak Lolos",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: 7,
    name: "Darlene Robertson",
    role: "Nursing Assistant",
    status: "Tidak Lolos",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=7",
  },
  {
    id: 8,
    name: "Ronald Richards",
    role: "Marketing Coordinator",
    status: "Lolos",
    date: "12 Mar",
    avatar: "https://i.pravatar.cc/150?u=8",
  },
];

export const jadwalWawancara = [
  {
    id: 1,
    name: "Rizky Handoko",
    role: "UI/UX Designer",
    project: "Redesign web toko",
    date: "12 Maret 2026",
  },
  {
    id: 2,
    name: "Ralph Edwards",
    role: "UI/UX Designer",
    project: "Redesign web toko",
    date: "12 Maret 2026",
  },
  {
    id: 3,
    name: "Ralph Edwards",
    role: "UI/UX Designer",
    project: "Redesign web toko",
    date: "12 Maret 2026",
  },
];

export const daftarLowongan = [
  {
    id: 1,
    role: "UI/UX Designer",
    type: "Redesign web toko - berbasis proyek",
    status: "Buka",
    date: "12 Mar",
  },
  {
    id: 2,
    role: "Kasir",
    type: "Kasir harian - berbasis shift",
    status: "Segera Tutup",
    date: "12 Mar",
  },
  {
    id: 3,
    role: "Fotografer",
    type: "Katalog produk - berbasis proyek",
    status: "Tutup",
    date: "12 Mar",
  },
  {
    id: 4,
    role: "Content Creator",
    type: "Konten video pendek - berbasis proyek",
    status: "Buka",
    date: "12 Mar",
  },
  {
    id: 5,
    role: "Customer Service",
    type: "Customer service harian - berbasis shift",
    status: "Tutup",
    date: "12 Mar",
  },
];

export const dataStatCard: StatCard = {
  rekrutmen: [
    {
      title: "Lamaran Masuk",
      value: "12",
      colorClass: "text-error",
    },
    {
      title: "Dalam Seleksi",
      value: "5",
      colorClass: "text-warning",
    },
    {
      title: "Talent Diterima",
      value: "3",
      colorClass: "text-primary",
    },
    {
      title: "Posisi Terbuka",
      value: "5",
      colorClass: "text-success",
    },
  ],
  project: [
    {
      title: "Project Aktif",
      value: "12",
      colorClass: "text-primary",
    },
    {
      title: "Perlu Review",
      value: "5",
      colorClass: "text-warning",
    },
    {
      title: "Perlu Revisi",
      value: "3",
      colorClass: "text-error",
    },
    {
      title: "Project Selesai",
      value: "5",
      colorClass: "text-success",
    },
  ],
  shift: [
    {
      title: "Shift Aktif",
      value: "12",
      colorClass: "text-primary",
    },
    {
      title: "Perlu Konfirmasi",
      value: "5",
      colorClass: "text-warning",
    },
    {
      title: "Shift Selesai",
      value: "3",
      colorClass: "text-success",
    },
    {
      title: "Total Shift",
      value: "5",
      colorClass: "text-success",
    },
  ],
};

export const tabs: TabsData[] = [
  {
    key: "rekrutmen",
    label: "Rekrutmen & Lamaran",
  },
  {
    key: "project",
    label: "Project & Task",
  },
  {
    key: "shift",
    label: "Shift Harian",
  },
];

export const dataCardBisnis = [
  {
    title: "Buat Lowongan",
    description: "Pasang posisi & mulai terima pelamar.",
    Icon: RiUserSearchFill,
    link: "/umkm/add-lowongan",
  },
  {
    title: "Kelola Pelamar",
    description: "Seleksi & Wawancara kandidat terbaik.",
    Icon: FaUserPlus,
    link: "/umkm/dashboard/lamaran-masuk",
  },
  {
    title: "Proyek & Task",
    description: "Pantau progres proyek tim secara langsung.",
    Icon: BiSolidNotepad,
    link: "/umkm/dashboard/data-project",
  },
  {
    title: "Shift Harian",
    description: "Atur jadwal & konfirmasi kehadiran",
    Icon: FaUserClock,
    link: "/umkm/dashboard/data-shift",
  },
];

export const mockJobOpenings: JobOpening[] = [
  {
    id: 1,
    title: "UI/UX Designer",
    type: "Berbasis Proyek",
    status: "Buka",
    date: "12 Maret 2026",
    iconStr: "🎨",
    iconBgClass: "bg-teal-50",
    applicantImages: [
      "https://i.pravatar.cc/150?u=1",
      "https://i.pravatar.cc/150?u=2",
      "https://i.pravatar.cc/150?u=3",
    ],
    extraApplicants: 1,
  },
  {
    id: 2,
    title: "Web Designer",
    type: "Berbasis Proyek",
    status: "Segera Tutup",
    date: "12 Maret 2026",
    iconStr: "💻",
    iconBgClass: "bg-orange-50",
    applicantImages: [
      "https://i.pravatar.cc/150?u=4",
      "https://i.pravatar.cc/150?u=5",
      "https://i.pravatar.cc/150?u=6",
    ],
    extraApplicants: 1,
  },
  {
    id: 3,
    title: "Data Analyst",
    type: "Berbasis Proyek",
    status: "Buka",
    date: "12 Maret 2026",
    iconStr: "📊",
    iconBgClass: "bg-blue-50",
    applicantImages: [
      "https://i.pravatar.cc/150?u=7",
      "https://i.pravatar.cc/150?u=8",
      "https://i.pravatar.cc/150?u=9",
    ],
    extraApplicants: 1,
  },
  {
    id: 4,
    title: "Back End Dev",
    type: "Berbasis Proyek",
    status: "Buka",
    date: "13 Maret 2026",
    iconStr: "⚙️",
    iconBgClass: "bg-teal-50",
    applicantImages: [
      "https://i.pravatar.cc/150?u=10",
      "https://i.pravatar.cc/150?u=11",
      "https://i.pravatar.cc/150?u=12",
    ],
    extraApplicants: 1,
  },
  {
    id: 5,
    title: "Barista",
    type: "Berbasis Proyek",
    status: "Tutup",
    date: "12 Maret 2026",
    iconStr: "☕",
    iconBgClass: "bg-red-50",
    applicantImages: [
      "https://i.pravatar.cc/150?u=13",
      "https://i.pravatar.cc/150?u=14",
      "https://i.pravatar.cc/150?u=15",
    ],
    extraApplicants: 1,
  },
  {
    id: 6,
    title: "Barista",
    type: "Berbasis Proyek",
    status: "Tutup",
    date: "12 Maret 2026",
    iconStr: "☕",
    iconBgClass: "bg-red-50",
    applicantImages: [
      "https://i.pravatar.cc/150?u=16",
      "https://i.pravatar.cc/150?u=17",
      "https://i.pravatar.cc/150?u=18",
    ],
    extraApplicants: 1,
  },
];

export const statCardDataLowongan: StatCardDataType[] = [
  {
    title: "Posisi Buka",
    value: 0,
    colorClass: "text-success",
  },
  {
    title: "Segera Tutup",
    value: 0,
    colorClass: "text-warning",
  },
  {
    title: "Sudah Tutup",
    value: 0,
    colorClass: "text-error",
  },
  {
    title: "Total Pelamar",
    value: 0,
    colorClass: "text-primary",
  },
];

export const mockContacts: ContactItem[] = [
  { id: "1", label: "Website", value: "www.sambalbakarnusantara.com" },
  { id: "2", label: "Email HRD", value: "hrd@sambalbakar.id" },
  { id: "3", label: "Telepon", value: "+62 812-3456-7890" },
  { id: "4", label: "Alamat", value: "Jl. Kemang Raya No. 45, Jaksel" },
];

export const mockBenefits: BenefitItem[] = [
  {
    id: "1",
    title: "Gaji Kompetitif",
    description: "Gaji pokok + bonus performa bulanan transparan",
  },
  {
    id: "2",
    title: "BPJS Lengkap",
    description: "BPJS Kesehatan & Ketenagakerjaan ditanggung penuh",
  },
  {
    id: "3",
    title: "Makan Gratis",
    description: "1x makan gratis setiap shift kerja berlangsung",
  },
];

export const mockTestimonials: TestimonialItem[] = [
  {
    id: "1",
    name: "Aris Setiawan",
    quote:
      "Lingkungan kerja sangat suportif. Saya belajar banyak tentang kuliner tradisional dan modernisasinya. Manajemen terbuka menerima masukan.",
    rating: 5,
  },
  {
    id: "2",
    name: "Jane Doe",
    quote:
      "Rekan kerja sangat ramah dan saling membantu. Tempatnya bersih dan peralatannya lengkap. Sangat recommended!",
    rating: 5,
  },
  {
    id: "3",
    name: "Jane Doe",
    quote:
      "Rekan kerja sangat ramah dan saling membantu. Tempatnya bersih dan peralatannya lengkap. Sangat recommended!",
    rating: 5,
  },
];

export const projectProgress = [
  {
    title: "Redesign Website Toko",
    role: "UI/UX Designer",
    taskInfo: "7/11 task",
    deadline: "28 Maret 2026",
    status: "Review",
    progress: 70,
  },
  {
    title: "Redesign Website Toko",
    role: "UI/UX Designer",
    taskInfo: "7/11 task",
    deadline: "28 Maret 2026",
    status: "Review",
    progress: 70,
  },
  {
    title: "Redesign Website Toko",
    role: "UI/UX Designer",
    taskInfo: "7/11 task",
    deadline: "28 Maret 2026",
    status: "Review",
    progress: 70,
  },
];

export const taskList: TaskListType[] = [
  {
    title: "Wireframe Halaman Utama",
    assignee: "Rizki Handoko",
    project: "Redesign Web Toko",
    deadline: "28-03-2026",
    status: "Draft",
  },
  {
    title: "Wireframe Halaman Utama",
    assignee: "Rizki Handoko",
    project: "Redesign Web Toko",
    deadline: "28-03-2026",
    status: "Draft",
  },
  {
    title: "Wireframe Halaman Utama",
    assignee: "Rizki Handoko",
    project: "Redesign Web Toko",
    deadline: "28-03-2026",
    status: "Selesai",
  },
  {
    title: "Wireframe Halaman Utama",
    assignee: "Rizki Handoko",
    project: "Redesign Web Toko",
    deadline: "28-03-2026",
    status: "Draft",
  },
];

export const mockShifts: Shift[] = [
  {
    id: 1,
    divisi_shift: "UI/UX Designer",
    nama_pekerja_shift: "Rizky Handoko",
    nama_shift: "Morning Design Review",
    list_tugas_shift: [
      "Membuat wireframe",
      "Revisi dashboard",
      "Push Github",
    ],
    waktu_mulai_shift: "08:00",
    waktu_selesai_shift: "12:00",
    jenis_shift: "pagi",
    tanggal_shift: "2026-05-07",
    jam_masuk: "07:55",
    jam_pulang: "12:05",
    status_shift: "Review",
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    nama_project: "Redesign Landing Page FreshStart",
    divisi_project: "UI/UX Design",
    deskripsi_project: "Melakukan redesign landing page FreshStart agar lebih modern dan responsif sesuai brand guideline terbaru perusahaan.",
    tanggal_mulai_project: "2026-05-01",
    tanggal_selesai_project: "2026-06-01",
    list_tugas_project: [
      "Riset kompetitor dan referensi desain",
      "Membuat wireframe halaman utama",
      "Desain UI di Figma",
      "Handoff ke tim developer",
    ],
    anggota_tim_project: "Budi Santoso, Rina Dewi, Cahyo",
    penanggung_jawab_project: "Rina Dewi",
    status_project: "Review",
  },
];

export const dataDummy: Pelamar[] = [
  {
    id: 1,
    nama_pelamar: "Kathryn Murphy",
    posisi_pelamar: "UI/UX Designer",
    pendidikan_terakhir_pelamar: "S1 Desain Komunikasi Visual",
    kontak_pelamar: "081234567890",
    tanggal_melamar: "19 Maret 2025",
    status_pelamar: "Diterima",
  },
  {
    id: 2,
    nama_pelamar: "Devon Lane",
    posisi_pelamar: "Web Designer",
    pendidikan_terakhir_pelamar: "S1 Teknik Informatika",
    kontak_pelamar: "081234857690",
    tanggal_melamar: "22 Maret 2025",
    status_pelamar: "Ditolak",
  },
];

export const mockWawancara: (Pelamar & Wawancara)[] = [
  {
    // Data Pelamar
    id: 1,
    nama_pelamar: "Kathryn Murphy",
    posisi_pelamar: "UI/UX Designer",
    pendidikan_terakhir_pelamar: "S1 Desain Komunikasi Visual",
    kontak_pelamar: "081234567890",
    tanggal_melamar: "19 Maret 2025",
    status_pelamar: "Diterima",
    // Data Wawancara
    tanggal_wawancara: "2025-03-25",
    waktu_mulai_wawancara: "10:00",
    waktu_selesai_wawancara: "11:00",
    metode_wawancara: "Google Meet",
    tautan_wawancara: "meet.google.com/abc-xyz",
    note_wawancara: "Siapkan portofolio desain sebelum interview",
    status_wawancara: "Wawancara",
  },
  {
    id: 2,
    nama_pelamar: "Devon Lane",
    posisi_pelamar: "Web Designer",
    pendidikan_terakhir_pelamar: "S1 Teknik Informatika",
    kontak_pelamar: "081234857690",
    tanggal_melamar: "22 Maret 2025",
    status_pelamar: "Diterima",
    tanggal_wawancara: "2025-03-26",
    waktu_mulai_wawancara: "13:00",
    waktu_selesai_wawancara: "14:00",
    metode_wawancara: "Tatap Muka",
    tautan_wawancara: "Jl. Kemang Raya No. 45, Jaksel",
    note_wawancara: "Bawa CV dan portofolio fisik",
    status_wawancara: "Wawancara",
  },
];

