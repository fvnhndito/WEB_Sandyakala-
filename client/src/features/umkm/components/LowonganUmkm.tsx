import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import HeroSection from "./HeroSection";
import BgImgRekrutmen from "@/assets/images/Bg Img Dashboard Umkm.png";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { mockJobOpenings, statCardDataLowongan } from "../constants/mock-data";
import JobCard from "./ui/JobCard";
import { EmptyData } from "./ui/EmptyData";
import ImgEmptyData from "@/assets/images/Img Empty Data - Lowongan.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LowonganUmkm() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusOptions = ["Buka", "Tutup", "Segera Tutup"];
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLowongan = mockJobOpenings.filter((item) => {
    const matchStatus = selectedStatus
      ? item.status_lowongan.toLowerCase() === selectedStatus
      : true;
    const matchSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  return (
    <DashboardUmkmLayout>
      <HeroSection
        title="Lowongan Pekerjaan"
        description="Kelola semua posisi yang dibuka untuk UMKM Anda"
        statCardData={statCardDataLowongan}
        bgImage={BgImgRekrutmen}
        isShowTabs={false}
      />

      <div className="container pb-10">
        {mockJobOpenings.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-4 w-full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau posisi..."
                className="rounded-md md:flex-1 focus:border-mint focus:ring-mint-100 text-sm"
              />
              {statusOptions.length > 0 && (
                <select
                  value={selectedStatus}
                  className="border border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:bg-mint-100/15"
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                  }}
                >
                  <option value="">Semua Status</option>

                  {statusOptions.map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
              <Button
                variant="outline"
                className="text-xs gap-1 border border-mint text-mint py-3 hover:bg-mint-100"
                onClick={() => navigate("/umkm/add-lowongan")}
              >
                <FaPlus className="text-sm " /> Tambah Lowongan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-5xl mx-auto mt-7">
              {filteredLowongan.length > 0 ? (
                filteredLowongan.map((job) => (
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
