import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import TabRekrutmen from "./TabRekrutmen";
import TabProject from "./TabProject";
import TabShift from "./TabShift";
import type { TabsType, StatCardDataType } from "../types/dashboard.types";
import HeroSection from "./HeroSection";
import { useState, useEffect } from "react";
import { apiRequest } from "@/shared/lib/api";
import BgImgRekrutmen from "@/assets/images/Bg Img Dashboard Umkm.png";
import BgImgTabProject from "@/assets/images/Bg Img Tab Project.png";
import BgImgTabShift from "@/assets/images/Bg Img Tab Shift.png";
import { dataStatCard } from "../constants/mock-data";

export default function DashboardUmkm() {
  const token = localStorage.getItem("accessToken");
  const [activeTab, setActiveTab] = useState<TabsType>("rekrutmen");
  const [statRekrutmen, setStatRekrutmen] = useState<StatCardDataType[]>(
    dataStatCard.rekrutmen,
  );
  const [statShift, setStatShift] = useState<StatCardDataType[]>(
    dataStatCard.shift,
  );
  const [statProject, setStatProject] = useState<StatCardDataType[]>(
    dataStatCard.project,
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [resApplicants, resInterviews, resWorkers, resJobs] =
          await Promise.all([
            apiRequest<any>("/applications/umkm", {
              method: "GET",
              headers,
            }),
            apiRequest<any>("/applications/umkm/interviews", {
              method: "GET",
              headers,
            }),
            apiRequest<any>("/applications/umkm/workers", {
              method: "GET",
              headers,
            }),
            apiRequest<any>("/jobs/umkm/me", {
              method: "GET",
              headers,
            }),
          ]);

        // REKRUTMEN
        const totalLamaran = resApplicants.success
          ? (Array.isArray(resApplicants.data)
              ? resApplicants.data
              : (resApplicants.data?.applicants ?? [])
            ).length
          : 0;

        const interviews = resInterviews.success
          ? Array.isArray(resInterviews.data)
            ? resInterviews.data
            : []
          : [];

        const totalSeleksi = interviews.filter(
          (i: any) => i.application_status === "INTERVIEW",
        ).length;

        const workers = resWorkers.success
          ? Array.isArray(resWorkers.data)
            ? resWorkers.data
            : []
          : [];

        const totalDiterima = workers.filter(
          (w: any) => w.status_pekerja === "Aktif",
        ).length;

        const allJobs = resJobs.success
          ? Array.isArray(resJobs.data)
            ? resJobs.data
            : []
          : [];

        const totalLowongan = allJobs.length;

        setStatRekrutmen([
          {
            title: "Lamaran Masuk",
            value: totalLamaran,
            colorClass: "text-error",
          },
          {
            title: "Dalam Seleksi",
            value: totalSeleksi,
            colorClass: "text-warning",
          },
          {
            title: "Talent Diterima",
            value: totalDiterima,
            colorClass: "text-info-300",
          },
          {
            title: "Posisi Terbuka",
            value: totalLowongan,
            colorClass: "text-success-300",
          },
        ]);

        // SHIFT
        const shiftJobs = allJobs.filter((job: any) => job.type === "SHIFT");

        const shiftDetails = await Promise.all(
          shiftJobs.map((job: any) =>
            apiRequest<any>(`/jobs/${job.id}`, {
              method: "GET",
              headers,
            }),
          ),
        );

        let totalShift = 0;
        let shiftPagi = 0;
        let shiftSiang = 0;
        let shiftMalam = 0;

        shiftDetails.forEach((res) => {
          if (!res.success || !res.data) return;

          (res.data.shifts ?? []).forEach((shift: string) => {
            totalShift++;

            const normalized = shift.trim().toUpperCase();

            if (normalized === "PAGI") shiftPagi++;
            if (normalized === "SIANG") shiftSiang++;
            if (normalized === "MALAM") shiftMalam++;
          });
        });

        setStatShift([
          {
            title: "Total Shift",
            value: totalShift,
            colorClass: "text-error",
          },
          {
            title: "Shift Pagi",
            value: shiftPagi,
            colorClass: "text-warning",
          },
          {
            title: "Shift Siang",
            value: shiftSiang,
            colorClass: "text-blue-500",
          },
          {
            title: "Shift Malam",
            value: shiftMalam,
            colorClass: "text-indigo-500",
          },
        ]);

        // PROJECT
        const projectJobs = allJobs.filter(
          (job: any) => job.type === "PROJECT",
        );

        const projectDetails = await Promise.all(
          projectJobs.map((job: any) =>
            apiRequest<any>(`/jobs/${job.id}`, {
              method: "GET",
              headers,
            }),
          ),
        );

        let projectAktif = 0;
        let perluReview = 0;
        let perluRevisi = 0;
        let projectSelesai = 0;

        projectDetails.forEach((res) => {
          if (!res.success || !res.data) return;

          (res.data.project_tasks ?? []).forEach((task: any) => {
            projectAktif++;

            const status = task.status?.toUpperCase();

            if (status === "REVIEW") perluReview++;
            if (status === "REVISI") perluRevisi++;
            if (status === "SELESAI") projectSelesai++;
          });
        });

        setStatProject([
          {
            title: "Project Aktif",
            value: projectAktif,
            colorClass: "text-blue-500",
          },
          {
            title: "Perlu Review",
            value: perluReview,
            colorClass: "text-warning",
          },
          {
            title: "Perlu Revisi",
            value: perluRevisi,
            colorClass: "text-error",
          },
          {
            title: "Project Selesai",
            value: projectSelesai,
            colorClass: "text-success-300",
          },
        ]);
      } catch (error) {
        console.error("Gagal mengambil statistik dashboard:", error);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <DashboardUmkmLayout>
      {activeTab === "rekrutmen" ? (
        <HeroSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          description="Pantau rekrutmen dan seleksi talenta usahamu"
          isShowButtonRight={true}
          statCardData={statRekrutmen}
          bgImage={BgImgRekrutmen}
        />
      ) : activeTab === "project" ? (
        <HeroSection
          title="Status Proyek Saat Ini"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          description="Pantau tugas proyek dari pekerja mu"
          isShowButtonRight={false}
          statCardData={statProject}
          bgImage={BgImgTabProject}
        />
      ) : (
        <HeroSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isShowButtonRight={false}
          statCardData={statShift}
          isShowTitleDescription={false}
          bgImage={BgImgTabShift}
        />
      )}

      {activeTab === "rekrutmen" && <TabRekrutmen />}
      {activeTab === "project" && <TabProject />}
      {activeTab === "shift" && <TabShift />}
    </DashboardUmkmLayout>
  );
}
