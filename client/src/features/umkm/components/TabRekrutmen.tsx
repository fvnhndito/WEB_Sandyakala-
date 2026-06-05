import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { getBadgeStyle } from "../utils/badge-style";
import { Card, CardHeader } from "./ui/Card";
import { IoIosPeople } from "react-icons/io";
import { Button } from "@/shared/components/ui/button";
import { GoCalendar } from "react-icons/go";
import { FiPlus, FiUser } from "react-icons/fi";
import { apiRequest } from "@/shared/lib/api";
import { Link } from "react-router-dom";

const EmptyDataLamaran = () => (
  <>
    <div className="w-17 h-17 p-2 bg-neutral-200 rounded-full flex items-center justify-center mx-auto">
      <IoIosPeople className="fill-mint w-full h-full" />
    </div>
    <h3 className="font-bold text-center text-lg my-4">Belum ada pelamar</h3>
    <p className="mb-4 text-center text-sm text-gray-500">
      Daftar pelamar akan muncul di sini setelah Anda mempublikasikan lowongan
    </p>
    <Link to="/umkm/add-lowongan">
      <Button
        className="text-mint border-mint hover:bg-mint hover:text-mint-300 bg-mint-100 border rounded-md w-max mx-auto"
        size="sm"
      >
        Buat Lowongan
      </Button>
    </Link>
  </>
);

const EmptyDataWawancara = () => (
  <div className="flex items-center gap-5">
    <div className="h-18 w-18 aspect-square p-4 bg-neutral-100 rounded-full">
      <GoCalendar className="w-full h-full fill-mint" />
    </div>
    <div className="space-y-1">
      <h3 className="font-bold text-sm">Belum ada jadwal wawancara</h3>
      <p className="text-xs text-gray-300">
        Yuk, mulai seleksi pelamar untuk mengatur jadwal wawancara pertamamu!
      </p>
    </div>
  </div>
);

const EmptyDataLowongan = () => (
  <div className="border border-dashed border-neutral-300 flex flex-col items-center justify-center rounded-md">
    <Link to="/umkm/add-lowongan">
      <Button className="w-17 h-17 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center mx-auto mt-5">
        <FiPlus className="text-mint w-full h-full" />
      </Button>
    </Link>
    <h3 className="font-bold text-sm mb-1 mt-3">Tambah Posisi Pertama</h3>
    <p className="text-xs text-gray-300 mb-3">Belum ada posisi yang dibuka</p>
  </div>
);

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: "Menunggu",
    INTERVIEW: "Interview",
    ACCEPTED: "Diterima",
    REJECTED: "Ditolak",
  };
  return labels[status?.toUpperCase()] ?? status;
};

export default function TabRekrutmen() {
  const token = localStorage.getItem("accessToken");

  const [applicants, setApplicants] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          setError("Silakan login kembali.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [resApplicants, resInterviews, resJobs] = await Promise.all([
          apiRequest<any>("/applications/umkm", {
            method: "GET",
            headers,
          }),
          apiRequest<any>("/applications/umkm/interviews", {
            method: "GET",
            headers,
          }),
          apiRequest<any>("/jobs/umkm/me", {
            method: "GET",
            headers,
          }),
        ]);

        if (resApplicants.success && resApplicants.data) {
          const list = Array.isArray(resApplicants.data)
            ? resApplicants.data
            : (resApplicants.data.applicants ?? []);

          setApplicants(list.slice(0, 5));
        }

        if (resInterviews.success && resInterviews.data) {
          setInterviews(
            Array.isArray(resInterviews.data)
              ? resInterviews.data.slice(0, 3)
              : [],
          );
        }

        if (resJobs.success && resJobs.data) {
          setJobs(Array.isArray(resJobs.data) ? resJobs.data.slice(0, 5) : []);
        }
      } catch (error) {
        console.error("Gagal memuat data rekrutmen:", error);
        setError("Gagal memuat data rekrutmen.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  if (error) {
    return (
      <section className="container mx-auto px-4 md:px-8 pb-10">
        <p className="text-center py-10 text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 md:px-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lamaran Terbaru */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader
              title="Lamaran Terbaru"
              linkTitle="Seleksi Pelamar"
              to="/umkm/dashboard/lamaran-masuk"
            />
            <div className="flex flex-col">
              {loading ? (
                <p className="text-center py-6 text-neutral-400 text-sm">
                  Memuat...
                </p>
              ) : applicants.length > 0 ? (
                applicants.map((item, index) => (
                  <div
                    key={item.application_id ?? index}
                    className="flex items-center justify-between py-4 border-b last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                        {item.profile_pic ? (
                          <img
                            src={item.profile_pic}
                            alt={item.applicant_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-xl text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-black text-xs md:text-base">
                          {item.applicant_name}
                        </h3>
                        <p className="text-gray-700 text-xs md:text-sm">
                          {item.job_title}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          "px-3 md:px-6 py-1 rounded-full text-[11px] md:text-xs font-semibold border",
                          getBadgeStyle(getStatusLabel(item.status)),
                        )}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.applied_at
                          ? new Date(item.applied_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyDataLamaran />
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Jadwal Wawancara */}
          <Card>
            <CardHeader
              title="Jadwal Wawancara"
              linkTitle="Lihat Wawancara"
              to="/umkm/dashboard/dalam-seleksi"
            />
            <div className="flex flex-col gap-3">
              {loading ? (
                <p className="text-center py-4 text-neutral-400 text-sm">
                  Memuat...
                </p>
              ) : interviews.length > 0 ? (
                interviews.map((item, index) => (
                  <div
                    key={item.interview_id ?? index}
                    className="bg-neutral-100 rounded-xl py-4 px-6 flex justify-between items-center border border-gray-50"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800 text-xs md:text-base">
                        {item.nama_pelamar}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {item.posisi_lowongan}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {item.metode_wawancara}
                      </p>
                    </div>
                    <span className="bg-red-200 text-red-600 px-3 py-1 rounded-full text-xs font-base whitespace-nowrap">
                      {item.tanggal_wawancara
                        ? new Date(item.tanggal_wawancara).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyDataWawancara />
              )}
            </div>
          </Card>

          {/* Daftar Lowongan */}
          <Card>
            <CardHeader
              title="Daftar Lowongan"
              linkTitle="Lihat Lowongan"
              to="/umkm/dashboard/posisi-terbuka"
            />
            <div className="flex flex-col">
              {loading ? (
                <p className="text-center py-4 text-neutral-400 text-sm">
                  Memuat...
                </p>
              ) : jobs.length > 0 ? (
                jobs.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <h3 className="font-bold text-black text-xs md:text-base">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-xs mt-0.5">
                        {item.type === "PROJECT"
                          ? "Berbasis Proyek"
                          : "Shift Harian"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={cn(
                          "px-4 py-1 rounded-full text-[11px] md:text-xs font-semibold border",
                          getBadgeStyle(item.status ?? "Aktif"),
                        )}
                      >
                        {item.status ?? "Aktif"}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.deadline || item.created_at
                          ? new Date(
                              item.deadline ?? item.created_at,
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyDataLowongan />
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
