import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Card, CardBody, CardHeader } from "@/shared/components/ui/card";
import { StatCard } from "@/shared/components/ui/stat-card";
import PopularUmkm from "./ui/PopularUmkm";
import ActionCard from "./ui/ActionCard";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import { IoIosWarning } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";

type StatusType = "pending" | "approved" | "rejected";

interface UmkmProfile {
  id: string;
  businessName: string;
  businessCategory: string;
  status: StatusType;
}

interface FgProfile {
  id: string;
  status: StatusType;
}

interface Report {
  id: string;
}

export default function DashboardAdmin() {
  const [umkmProfiles, setUmkmProfiles] = useState<UmkmProfile[]>([]);
  const [fgProfiles, setFgProfiles] = useState<FgProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [umkmRes, fgRes, reportRes] = await Promise.all([
          apiRequest<any[]>("/umkm"),
          apiRequest<any[]>("/fresh-graduate"),
          apiRequest<any[]>("/laporan"),
        ]);

        if (umkmRes.success && umkmRes.data) {
          setUmkmProfiles(
            umkmRes.data.map((item: any) => ({
              id: item.id_umkm,
              businessName: item.business_name,
              businessCategory: item.business_category,
              status: (item.status?.toLowerCase() as StatusType) ?? "pending",
            })),
          );
        }

        if (fgRes.success && fgRes.data) {
          setFgProfiles(
            fgRes.data.map((item: any) => ({
              id: item.id_fg,
              status: (item.status?.toLowerCase() as StatusType) ?? "pending",
            })),
          );
        }

        if (reportRes.success && reportRes.data) {
          setReports(reportRes.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const verifiedUmkm = umkmProfiles.filter(
      (item) => item.status === "approved",
    ).length;

    const verifiedFg = fgProfiles.filter(
      (item) => item.status === "approved",
    ).length;

    const pendingVerification =
      umkmProfiles.filter((item) => item.status === "pending").length +
      fgProfiles.filter((item) => item.status === "pending").length;

    return {
      verifiedUmkm,
      verifiedFg,
      pendingVerification,
      totalReports: reports.length,
    };
  }, [umkmProfiles, fgProfiles, reports]);

  const popularCategories = useMemo(() => {
    const approvedUmkm = umkmProfiles.filter(
      (item) => item.status === "approved",
    );

    const grouped = approvedUmkm.reduce(
      (acc, item) => {
        acc[item.businessCategory] = (acc[item.businessCategory] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [umkmProfiles]);

  const actionCards = [
    {
      title: "Review Pengajuan",
      description: `${stats.pendingVerification} pengajuan menunggu`,
      icon: FaCircleCheck,
      to: "/admin/verifikasi-umkm",
      variant: "info" as const,
      iconStyle: "h-10 w-10 fill-secondary",
    },
    {
      title: "Tindak Laporan",
      description: `${stats.totalReports} laporan aktif`,
      icon: IoIosWarning,
      to: "/admin/laporan",
      variant: "error" as const,
      iconStyle: "h-10 w-10 fill-error",
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      description="Ringkasan platform FreshStart"
    >
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-8 mb-4">
        <StatCard
          variant="green"
          title="UMKM Terverifikasi"
          value={stats.verifiedUmkm}
          description="UMKM aktif di platform"
        />

        <StatCard
          variant="blue"
          title="Fresh Graduate"
          value={stats.verifiedFg}
          description="FG terverifikasi"
        />

        <StatCard
          variant="yellow"
          title="Menunggu Verifikasi"
          value={stats.pendingVerification}
          description="Belum direview admin"
        />

        <StatCard
          variant="red"
          title="Laporan Masuk"
          value={stats.totalReports}
          description="Perlu ditindaklanjuti"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full mt-8">
        <div className="md:w-[60%] w-full">
          <Card className="bg-info-100/20 border-2 border-info-100">
            <CardHeader className="flex items-center justify-between py-4 border-b border-info-100">
              <h1 className="font-semibold text-base">
                Kategori UMKM Terpopuler
              </h1>
              <h2 className="font-semibold text-sm">
                {stats.verifiedUmkm} UMKM Aktif
              </h2>
            </CardHeader>
            <CardBody className="bg-white space-y-4 pb-6">
              {popularCategories.map((item, index) => (
                <PopularUmkm
                  key={index}
                  rank={index + 1}
                  category={item.category}
                  count={item.count}
                />
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="md:w-[40%] w-full">
          <Card className="bg-info-100/20 border-2 border-info-100">
            <CardHeader className="flex items-center justify-between py-4 border-b border-info-100">
              <h1 className="font-bold text-base">Aksi Cepat</h1>
            </CardHeader>
            <CardBody className="bg-white space-y-4 pt-5 pb-10">
              {actionCards.map((item, index) => (
                <ActionCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  icon={<item.icon className={item.iconStyle} />}
                  to={item.to}
                  variant={item.variant}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
