import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { FaBan } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdPauseCircleFilled } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "@/shared/lib/api";

export default function DetailReportAdmin() {
  const { namaUsaha = "" } = useParams<{ namaUsaha: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetail = async () => {
      setLoading(true);
      const response = await apiRequest<any>(`/reports/${namaUsaha}`);
      if (response.success && response.data) {
        setReport(response.data);
      }
      setLoading(false);
    };
    fetchReportDetail();
  }, [namaUsaha]);

  const handleAction = async (status: string) => {
    if (!report?.id) return;
    const response = await apiRequest(`/reports/${report.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (response.success) {
      navigate("/admin/laporan");
    } else {
      alert(response.message || "Gagal memproses tindakan laporan.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Memuat Detail Laporan..." showBackButton>
        <div className="flex justify-center py-20 text-gray-500 font-semibold">
          Memuat data laporan...
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout title="Laporan Tidak Ditemukan" showBackButton>
        <div className="flex justify-center py-20 text-red-500 font-semibold">
          Laporan tidak ditemukan atau telah dihapus.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Detail Laporan - ${report.namaUsaha}`}
      description="Menindaklanjuti pelanggaran yang dilakukan UMKM"
      showBackButton
    >
      <div className="flex justify-center">
        <Card className="max-w-2xl w-full border-2 border-info-100">
          <CardHeader className="flex justify-between items-center border-b-2 border-info-100">
            <h1 className="md:text-md text-xl font-bold">Informasi Laporan</h1>
            <Badge
              size={"sm"}
              variant={
                report.status === "Menunggu" ? "warning" :
                report.status === "Valid" ? "success2" :
                report.status === "Peringatan" ? "orange" :
                report.status === "Blokir" ? "error" : "gray"
              }
              className="border-none text-black"
            >
              {report.status}
            </Badge>
          </CardHeader>
          <CardBody>
            <h1 className="text-2xl mb-2 font-extrabold">
              {report.namaUsaha}
            </h1>
            <p className="font-semibold mb-2 text-sm">
              Kategori : {report.category || "Umum"}
            </p>
            <p className="font-semibold mb-6 text-sm">
              Nama Pemilik : {report.ownerName || "-"}
            </p>

            <div className="mb-4">
              <p className="font-medium text-sm text-slate-400">
                Kategori Pelanggaran
              </p>
              <h3 className="font-bold text-sm">{report.kategoriPelanggaran}</h3>
            </div>

            <p className="font-medium text-sm text-slate-400">
              Alasan Pelaporan
            </p>
            <h3 className="font-bold text-sm text-slate-700 leading-relaxed">
              {report.alasanPelaporan}
            </h3>
          </CardBody>
          {report.status === "Menunggu" && (
            <CardFooter className="bg-info-100/30 flex gap-5 justify-between px-10 border-t-2 border-info-100">
              <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-2">
                <Button
                  onClick={() => handleAction("Valid")}
                  className="bg-info-200 w-full border-info border text-info-300 hover:text-white hover:bg-info font-bold flex flex-col gap-1 lg:text-xl text-base py-3 h-auto"
                >
                  <MdPauseCircleFilled className="h-7 w-7 lg:h-10 lg:w-10 fill-blue-600" />
                  Terima
                  <span className="text-[10px] font-normal leading-tight">Akun dibekukan sementara waktu</span>
                </Button>
                <Button
                  onClick={() => handleAction("Blokir")}
                  className="bg-red-200 w-full border-red-500 border text-red-400 hover:text-white hover:bg-red-500 font-bold flex flex-col gap-1 lg:text-xl text-base py-3 h-auto"
                >
                  <FaBan className="h-7 w-7 lg:h-10 lg:w-10 fill-red-400" />
                  Ban Permanen
                  <span className="text-[10px] font-normal leading-tight">Akun dihapus & diblokir selamanya</span>
                </Button>
                <Button
                  onClick={() => handleAction("Peringatan")}
                  className="bg-orange-200 w-full border-orange-500 border text-orange-400 hover:text-white hover:bg-orange-500 font-bold flex flex-col gap-1 lg:text-xl text-base py-3 h-auto"
                >
                  <PiWarningCircle className="h-7 w-7 lg:h-10 lg:w-10 fill-orange-400" />
                  Beri Peringatan
                  <span className="text-[10px] font-normal leading-tight">Kirim Notifikasi Pelanggaran Resmi</span>
                </Button>
                <Button
                  onClick={() => handleAction("Ditolak")}
                  className="bg-slate-200 w-full border-slate-500 border text-slate-600 hover:text-white hover:bg-slate-500 font-bold flex flex-col gap-1 lg:text-xl text-base py-3 h-auto"
                >
                  <IoClose className="h-7 w-7 lg:h-10 lg:w-10 fill-slate-400" />
                  Abaikan
                  <span className="text-[10px] font-normal leading-tight">Laporan tidak terbukti, tutup kasus</span>
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Helper badge component mapping if Badge is not defined locally
import { cn } from "@/shared/lib/utils";
function Badge({ children, variant, className }: any) {
  const variants: any = {
    warning: "bg-yellow-100 text-yellow-800",
    success2: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
    error: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800"
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}
