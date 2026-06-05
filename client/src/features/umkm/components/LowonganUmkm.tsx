import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import HeroSection from "./HeroSection";
import BgImgRekrutmen from "@/assets/images/Bg Img Dashboard Umkm.png";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import JobCard from "./ui/JobCard";
import { EmptyData } from "./ui/EmptyData";
import ImgEmptyData from "@/assets/images/Img Empty Data - Lowongan.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/shared/lib/api";

interface ApiJob {
  id: number;
  title: string;
  type: string;
  salary_min?: number;
  salary_max?: number;
  worker_needed: number;
  deadline?: string | null;
  created_at: string;
}

interface JobCardData {
  id: number;
  title: string;
  type: string;
  status_lowongan: "Buka" | "Segera Tutup" | "Tutup";
  date: string;
  iconStr: string;
  iconBgClass: string;
  applicantImages: string[];
  extraApplicants: number;
  applicantCount: number;
}

// Hitung status berdasarkan deadline
const getJobStatus = (
  deadline?: string | null,
): "Buka" | "Segera Tutup" | "Tutup" => {
  if (!deadline) return "Tutup";

  const now = new Date();
  const deadlineDate = new Date(deadline);

  const diffDays = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return "Tutup";
  if (diffDays <= 7) return "Segera Tutup";

  return "Buka";
};

// Icon berdasarkan tipe job
const getJobIcon = (type: string): { iconStr: string; iconBgClass: string } => {
  if (type === "PROJECT") return { iconStr: "🖥️", iconBgClass: "bg-blue-50" };
  if (type === "SHIFT") return { iconStr: "⏰", iconBgClass: "bg-orange-50" };
  return { iconStr: "💼", iconBgClass: "bg-gray-50" };
};

export default function LowonganUmkm() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("accessToken");
  const statusOptions = ["Buka", "Segera Tutup", "Tutup"];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
  try {
    setLoading(true);

    if (!token) {
      setJobs([]);
      return;
    }

    const [jobsRes, appsRes] = await Promise.all([
      apiRequest<any>("/jobs/umkm/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      apiRequest<any>("/applications/umkm", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (!jobsRes.success || !jobsRes.data) {
      setJobs([]);
      return;
    }

    const apiJobs: ApiJob[] = Array.isArray(jobsRes.data)
      ? jobsRes.data
      : [];

    const applicantsByJobId: Record<number, string[]> = {};

    if (appsRes.success && appsRes.data) {
      const apps = Array.isArray(appsRes.data)
        ? appsRes.data
        : ((appsRes.data as any).applicants ?? []);

      apps.forEach((a: any) => {
        const jid = Number(a.job_id);

        if (!applicantsByJobId[jid]) {
          applicantsByJobId[jid] = [];
        }

        const img =
          a.profile_pic ||
          `https://i.pravatar.cc/150?u=${a.applicant_name}`;

        if (!applicantsByJobId[jid].includes(img)) {
          applicantsByJobId[jid].push(img);
        }
      });
    }

    const mapped: JobCardData[] = apiJobs.map((job) => {
      const { iconStr, iconBgClass } = getJobIcon(job.type);

      const allApplicants = applicantsByJobId[job.id] ?? [];

      const visibleImages = allApplicants.slice(0, 3);

      return {
        id: job.id,
        title: job.title,
        type:
          job.type === "PROJECT"
            ? "Berbasis Proyek"
            : "Shift Harian",

        status_lowongan: job.deadline
          ? getJobStatus(job.deadline)
          : "Tutup",

        date: new Date(
          job.created_at,
        ).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),

        iconStr,
        iconBgClass,

        applicantImages: visibleImages,

        extraApplicants: Math.max(
          0,
          allApplicants.length - 3,
        ),

        applicantCount: allApplicants.length,
      };
    });

    setJobs(mapped);
  } catch (error) {
    console.error("Gagal memuat lowongan:", error);
    setJobs([]);
  } finally {
    setLoading(false);
  }
};

  const filteredJobs = jobs.filter((job) => {
    const matchStatus = selectedStatus
      ? job.status_lowongan.toLowerCase() === selectedStatus.toLowerCase()
      : true;
    const matchSearch = searchQuery
      ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  // Hitung stat card dari data real
  const statCardData = [
  {
    title: "Posisi Buka",
    value: jobs.filter(
      (j) => j.status_lowongan === "Buka",
    ).length,
    colorClass: "text-success",
  },
  {
    title: "Segera Tutup",
    value: jobs.filter(
      (j) => j.status_lowongan === "Segera Tutup",
    ).length,
    colorClass: "text-warning-300",
  },
  {
    title: "Sudah Tutup",
    value: jobs.filter(
      (j) => j.status_lowongan === "Tutup",
    ).length,
    colorClass: "text-error",
  },
  {
    title: "Total Pelamar",
    value: jobs.reduce(
      (total, job) => total + job.applicantCount,
      0,
    ),
    colorClass: "text-blue-500",
  },
];

  return (
    <DashboardUmkmLayout>
      <HeroSection
        title="Lowongan Pekerjaan"
        description="Kelola semua posisi yang dibuka untuk UMKM Anda"
        statCardData={statCardData}
        bgImage={BgImgRekrutmen}
        isShowTabs={false}
      />

      <div className="container pb-10">
        {loading ? (
          <p className="text-center py-10 text-neutral-500">Memuat data...</p>
        ) : jobs.length > 0 ? (
          <>
            <div className="max-w-5xl mx-auto w-full flex flex-wrap items-center gap-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau posisi..."
                className="rounded-md flex-1 focus:border-mint focus:ring-mint-100 text-sm"
              />
              <select
                value={selectedStatus}
                className="border border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:bg-mint-100/15"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                className="text-xs gap-1 border border-mint text-mint py-3 hover:bg-mint-100"
                onClick={() => navigate("/umkm/add-lowongan")}
              >
                <FaPlus className="text-sm" /> Tambah Lowongan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-5xl mx-auto mt-7">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard key={job.id} data={job} />
                ))
              ) : (
                <p className="text-neutral-500 col-span-2 text-center py-10">
                  Tidak ada lowongan dengan status ini
                </p>
              )}
            </div>
          </>
        ) : (
          <EmptyData
            title="Belum Ada Lowongan"
            description="Anda belum menambahkan lowongan kerja. Mulai temukan talenta terbaik untuk bisnis Anda."
            actionLabel="Tambah Lowongan Sekarang"
            actionTo="/umkm/add-lowongan"
            image={ImgEmptyData}
          />
        )}
      </div>
    </DashboardUmkmLayout>
  );
}
