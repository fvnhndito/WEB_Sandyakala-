import type { StatCardDataType, TabsType } from "../types/dashboard.types";
import { tabs } from "../constants/mock-data";
import { cn } from "@/shared/lib/utils";
import { Link } from "react-router-dom";
import StatCard from "./ui/StatCard";

interface HeroSectionProps {
  title?: string;
  description?: string;
  isShowTitleDescription?: boolean;
  isShowButtonRight?: boolean;
  isShowTabs?: boolean;
  statCardData: StatCardDataType[];
  activeTab?: TabsType;
  setActiveTab?: (tab: TabsType) => void;
  bgImage: string;
}

export default function HeroSection(props: HeroSectionProps) {
  const {
    title = "Status Lamaran Saat Ini",
    description,
    isShowTitleDescription = true,
    isShowButtonRight = false,
    statCardData,
    activeTab,
    setActiveTab,
    bgImage,
    isShowTabs = true,
  } = props;

  return (
    <section className="w-full pt-16 md:pt-12 bg-white">
      <div
        className="relative bg-cover bg-center min-h-350px md:h-87.5 w-full pb-20 md:pb-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay Gelap */}
        {/* <div className="absolute inset-0 bg-black/50"></div> */}

        <div className="relative z-10 container px-4 md:px-8 pt-8 md:pt-18 h-full flex flex-col">
          {isShowTabs && (
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 w-full">
              <div className="flex overflow-x-auto gap-3 pb-2 w-full md:w-auto scrollbar-hide items-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab?.(tab.key)}
                    className={cn(
                      "md:px-5 px-3.5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-base transition-all whitespace-nowrap cursor-pointer",
                      activeTab === tab.key
                        ? "bg-white text-mint-300 shadow-sm"
                        : "border border-white/80 text-white hover:bg-white/20 hover:border-white",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {isShowButtonRight && (
                <Link
                  to="/umkm/dashboard/lamaran-masuk"
                  className="md:px-5 px-3.5 py-1.5 md:py-2.5 rounded-full bg-white text-mint font-medium text-xs md:text-sm shadow-md hover:bg-gray-50 transition-colors w-fit"
                >
                  Seleksi Pelamar
                </Link>
              )}
            </div>
          )}

          <div className={cn("md:mt-10 mt-5", !isShowTabs && "md:mt-25 mt-27")}>
            {isShowTitleDescription ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {title}
                </h2>
                <p className="text-gray-200 text-sm font-medium">
                  {description ?? ""}
                </p>
              </>
            ) : (
              <p className="px-3 py-2 border rounded-lg border-dashed text-sm border-white bg-primary/50 text-white max-w-3xl mx-auto">
                Shift Harian digunakan untuk pekerjaan non-proyek seperti koki,
                kasir, barista. Sistem kerjanya: pekerja check-in saat mulai →
                kerja → check-out + laporan & bukti → kamu review, nilai, dan
                konfirmasi selesai.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-4 md:px-8 md:-mt-19 -mt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCardData.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              colorClass={card.colorClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
