export type TabsType = "rekrutmen" | "project" | "shift";

export type StatCardDataType = {
  title: string;
  value: number | string;
  colorClass: string;
};

export type StatCard = {
  rekrutmen: StatCardDataType[];
  project: StatCardDataType[];
  shift: StatCardDataType[];
};

export type TabsData = {
  key: TabsType;
  label: string;
};

export type JobStatus = "Buka" | "Segera Tutup" | "Tutup";

export type JobOpening = {
  id: number;
  title: string;
  type: string;
  status: JobStatus;
  date: string;
  iconStr: string;
  iconBgClass: string;
  applicantImages: string[];
  extraApplicants: number;
};

export interface ContactItem {
  id: string;
  label: string;
  value: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  quote: string;
  rating: number;
}

// Add Shift Types
export type Shift = {
  id: number;
  nama_shift: string;
  divisi_shift: string;
  nama_pekerja_shift: string;
  waktu_mulai_shift: string;
  waktu_selesai_shift: string;
  jenis_shift: "pagi" | "siang" | "malam";
  tanggal_shift: string;
  jam_masuk: string;
  jam_pulang: string;
  list_tugas_shift: string[];
  status_shift: "Proses" | "Review" | "Disetujui";
};


// data pekerja
export type Employee = {
  id: string;
  nama_pekerja: string;
  posisi_pekerja: string;
  jenis_penugasan_pekerja: string;
  no_hp_pekerja: string;
  tanggal_masuk_pekerja: string;
  status_pekerja: "Aktif" | "Nonaktif";
  foto_pekerja?: string;
}

// Add Project Types
export type Project = {
  id: string;
  nama_project: string;
  divisi_project: string,
  deskripsi_project: string;
  tanggal_mulai_project: string;
  tanggal_selesai_project: string;
  list_tugas_project: string[];
  anggota_tim_project: string;
  penanggung_jawab_project: string;
  status_project: "Selesai" | "Review" | "Revisi";
};

export type StatusType = "Draft" | "Review" | "Revisi" | "Selesai";

export type TaskListType = {
  title: string;
  assignee: string;
  project: string;
  deadline: string;
  status: StatusType;
};
