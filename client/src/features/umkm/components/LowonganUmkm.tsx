import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import HeroSection from "./HeroSection";
import BgImgRekrutmen from "@/assets/images/Bg Img Dashboard Umkm.png";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { mockJobOpenings, statCardDataLowongan } from "../constants/mock-data";
import JobCard from "./ui/JobCard";
import { EmptyData } from "./ui/EmptyData";
import ImgEmptyData from "@/assets/images/Img Empty Data - Lowongan.png";

export default function LowonganUmkm() {
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
                placeholder="Cari nama atau posisi..."
                className="rounded-md md:flex-1 focus:border-mint focus:ring-mint-100 text-sm"
              />
              <Button variant="outline" className="text-xs gap-1 py-3">
                Status Lowongan <IoIosArrowDown className="text-sm " />
              </Button>
              <Button
                variant="outline"
                className="text-xs gap-1 border border-mint text-mint py-3 hover:bg-mint-100"
              >
                <FaPlus className="text-sm " /> Tambah Lowongan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-5xl mx-auto mt-7">
              {mockJobOpenings.map((job) => (
                <JobCard key={job.id} data={job} />
              ))}
            </div>
          </>
        ) : (
          <EmptyData
            title="Belum Ada Lowongan"
            description="Anda belum menambahkan lowongan kerja. Mulai temukan talenta terbaik untuk bisnis Anda."
            actionLabel="Tambah Lowongan Sekarang"
            actionTo="/umkm/lowongan"
            image={ImgEmptyData}
          />
        )}
      </div>
    </DashboardUmkmLayout>
  );
}
