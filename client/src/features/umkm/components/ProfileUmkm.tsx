import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import BgImgRekrutmen from "@/assets/images/Bg Img Dashboard Umkm.png";
import { Card } from "./ui/Card";
import { FiTrash } from "react-icons/fi";
import { IoLocationSharp, IoPeople } from "react-icons/io5";
import { MdStore, MdVerified } from "react-icons/md";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { HiOutlineMenuAlt2, HiViewGridAdd } from "react-icons/hi";
import { FaGift, FaStar } from "react-icons/fa6";
import InfoBadge from "./ui/InfoBadge";
import { Button } from "@/shared/components/ui/button";
import { mockTestimonials } from "../constants/mock-data";
import type { IconType } from "react-icons";
import { cn } from "@/shared/lib/utils";
import { ProfileUmkmProvider, useProfileUmkm } from "./ProfileUmkmContext";
import ProfileUmkmModals from "./ProfileUmkmModals";

const SectionHeader: React.FC<{
  title: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, actionText, onAction }) => (
  <div className="flex justify-between items-center mb-5">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-6 bg-info-300 rounded-full" />
      <h2 className="text-lg font-bold text-info-300">{title}</h2>
    </div>
    {actionText && (
      <Button
        variant={"outline"}
        onClick={onAction}
        className="px-4 py-1 rounded-full border border-teal-300 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
      >
        {actionText}
      </Button>
    )}
  </div>
);

const ForkKnifeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm8-7h-3v20h3v-8h3V9c0-3.87-3.13-7-7-7z" />
  </svg>
);

type EmptySectionProps = {
  icon: IconType;
  title: string;
  actionLabel?: string;
  className?: string;
};

export const EmptySection = ({
  icon: Icon,
  title,
  actionLabel,
  className,
}: EmptySectionProps) => {
  return (
    <div className={cn("flex flex-col gap-4 items-center w-full text-center", className)}>
      <div className="h-12 w-12 bg-gray-100 flex justify-center items-center p-2 rounded-full">
        <Icon className="h-full w-full text-mint" />
      </div>
      <p className="text-sm md:text-base text-gray-400">{title}</p>
      {actionLabel && (
        <Button variant="mint" size={"sm"} className="rounded-md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

function ProfileUmkmContent() {
  const {
    openModal,
    namaUsaha, keteranganUsaha, lokasiUsaha,
    tahunDibangun, jumlahKaryawan, kategoriUsaha,
    fasilitas, handleHapusFasilitas,
    website, emailHrd, telepon, alamat,
    logoUsaha,
  } = useProfileUmkm();

  return (
    <DashboardUmkmLayout>
      <section className="w-full pt-7 md:pt-12 bg-white">
        <div
          className="relative bg-cover bg-center h-70 w-full"
          style={{ backgroundImage: `url(${BgImgRekrutmen})` }}
        />

        <div className="relative z-20 container mx-auto md:px-8 md:-mt-19 -mt-15 sm:-mt-20 pb-12">
          <Card className="w-full flex flex-col md:h-60 md:flex-row items-start md:items-center gap-6 relative">
            <div className="w-24 h-24 md:w-34 md:h-34 rounded-full overflow-hidden bg-[#FFEDD5] flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
              {logoUsaha ? (
                <img
                  src={logoUsaha}
                  alt="Logo Usaha"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ForkKnifeIcon className="w-10 h-10 md:w-12 md:h-12 text-[#EA580C]" />
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 w-full">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl md:text-[22px] font-extrabold text-slate-800">
                      {namaUsaha}
                    </h1>
                    <MdVerified className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-slate-600 text-sm md:text-base mb-4 font-medium">
                    {keteranganUsaha}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <InfoBadge icon={<IoLocationSharp />} text={lokasiUsaha} />
                    <InfoBadge icon={<MdStore />} text={`Berdiri sejak ${tahunDibangun}`} />
                    <InfoBadge icon={<IoPeople />} text={`${jumlahKaryawan} Karyawan`} />
                    <InfoBadge icon={<BiSolidBriefcaseAlt />} text="4 Lowongan Aktif" />
                    <InfoBadge icon={<HiViewGridAdd />} text={kategoriUsaha} />
                  </div>
                </div>

                <button
                  onClick={() => openModal("profile")}
                  className="absolute top-6 right-6 md:static px-5 py-1.5 rounded-full border border-teal-300 text-teal-500 text-xs md:text-sm font-semibold hover:bg-teal-50 transition-colors shrink-0 cursor-pointer"
                >
                  Ubah
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Card>
                <SectionHeader
                  title="Tentang Kami"
                  actionText="Ubah"
                  onAction={() => openModal("tentang")}
                />
                <EmptySection
                  icon={HiOutlineMenuAlt2}
                  title="Belum ada deskripsi usaha"
                  actionLabel="Tambah Deskripsi"
                />
              </Card>

              <Card>
                <SectionHeader
                  title="Keuntungan & Fasilitas"
                  actionText="Tambah"
                  onAction={() => openModal("fasilitas")}
                />
                {fasilitas.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {fasilitas.map((benefit: { id: string; title: string; description: string }) => (
                      <div
                        key={benefit.id}
                        className="bg-neutral-100 rounded-xl p-4 flex flex-col justify-between relative group"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {benefit.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed pr-4">
                            {benefit.description}
                          </p>
                        </div>
                        <div
                          onClick={() => handleHapusFasilitas(benefit.id)}
                          className="absolute bottom-4 right-4 opacity-50 hover:opacity-100 hover:text-error cursor-pointer"
                        >
                          <FiTrash />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={FaGift}
                    title="Belum ada informasi fasilitas"
                    actionLabel="Tambah Fasilitas"
                  />
                )}
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="h-full">
                <SectionHeader
                  title="Kontak Kami"
                  actionText="Ubah"
                  onAction={() => openModal("kontak")}
                />
                <div className="space-y-3">
                  <div className="bg-neutral-100 rounded-xl p-4">
                    <span className="block text-xs font-medium text-info-300 mb-1">
                      Website/Sosial Media
                    </span>
                    <span className="block text-sm font-medium text-gray-800">
                      {website}
                    </span>
                  </div>
                  <div className="bg-neutral-100 rounded-xl p-4">
                    <span className="block text-xs font-medium text-info-300 mb-1">
                      Email Usaha
                    </span>
                    <span className="block text-sm font-medium text-gray-800">
                      {emailHrd}
                    </span>
                  </div>
                  <div className="bg-neutral-100 rounded-xl p-4">
                    <span className="block text-xs font-medium text-info-300 mb-1">
                      Telepon
                    </span>
                    <span className="block text-sm font-medium text-gray-800">
                      {telepon}
                    </span>
                  </div>
                  <div className="bg-neutral-100 rounded-xl p-4">
                    <span className="block text-xs font-medium text-info-300 mb-1">
                      Alamat
                    </span>
                    <span className="block text-sm font-medium text-gray-800">
                      {alamat}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card>
            <SectionHeader title="Kata Karyawan Kami" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockTestimonials.map((testimoni) => (
                <div
                  key={testimoni.id}
                  className="bg-neutral-100 rounded-xl p-5 flex flex-col h-full"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimoni.rating)].map((_, i) => (
                      <FaStar key={i} className="fill-warning-200" />
                    ))}
                  </div>
                  <p className="text-sm text-info-300 opacity-80 leading-relaxed mb-6 grow">
                    "{testimoni.quote}"
                  </p>
                  <h4 className="font-bold text-gray-900 text-sm">{testimoni.name}</h4>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ProfileUmkmModals />
    </DashboardUmkmLayout>
  );
}

export default function ProfileUmkm() {
  return (
    <ProfileUmkmProvider>
      <ProfileUmkmContent />
    </ProfileUmkmProvider>
  );
}