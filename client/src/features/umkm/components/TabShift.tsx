import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { lamaranTerbaru } from "../constants/mock-data";
import { cn } from "@/shared/lib/utils";
import { getBadgeStyle } from "../utils/badge-style";
import { Card } from "./ui/Card";
import TitleCard from "./ui/TitleCard";
import { EmptyData } from "./ui/EmptyData";
import ImgEmptyData from "@/assets/images/Img Empty Data - Tab Shift.png";

export default function TabShift() {
  return (
    <section className="container pb-10">
      <div className="flex gap-2 mb-8">
        <Link
          to="/umkm/dashboard/addshift"
          className="flex items-center gap-2 px-4 py-2.5 border hover:bg-mint-200 transition-all duration-100 hover:text-white cursor-pointer border-mint text-mint bg-mint-200/50 text-sm rounded-md"
        >
          <FaPlus className=" text-xl" /> Tambah Shift
        </Link>
        <Link
          to="/umkm/dashboard/data-shift"
          className="px-4 text-mint py-2.5 border hover:bg-mint-200/50 border-mint cursor-pointer text-sm rounded-md"
        >
          Lihat Shift
        </Link>
      </div>

      {lamaranTerbaru.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <TitleCard
              title="Status Pekerjaan Hari Ini"
              link="/umkm/projects"
            />

            <Card>
              <div className="flex flex-col">
                {lamaranTerbaru.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-100"
                      />
                      <div>
                        <h3 className="font-medium text-black text-xs md:text-base">
                          {item.name}
                        </h3>
                        <p className="text-gray-700 text-xs md:text-sm">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          "px-3 md:px-6 py-1 rounded-full text-[11px] md:text-xs font-semibold border",
                          getBadgeStyle(item.status),
                        )}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-3">
            <TitleCard title="Perlu Konfirmasi" link="/umkm/projects" />
            <Card>
              <div className="flex flex-col">
                {lamaranTerbaru.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-100"
                      />
                      <div>
                        <h3 className="font-medium text-black text-xs md:text-base">
                          {item.name}
                        </h3>
                        <p className="text-gray-700 text-xs md:text-sm">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          "px-3 md:px-6 py-1 rounded-full text-[11px] md:text-xs font-semibold border",
                          getBadgeStyle(item.status),
                        )}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyData
          title="Belum Ada Jadwal Shift"
          description="Atur pembagian tugas harian agar operasional bisnis berjalan lancar. Klik tombol di bawah untuk menambah shift."
          actionLabel="Tambah Shift Sekarang"
          actionTo="/umkm/dashboard"
          image={ImgEmptyData}
        />
      )}
    </section>
  );
}
