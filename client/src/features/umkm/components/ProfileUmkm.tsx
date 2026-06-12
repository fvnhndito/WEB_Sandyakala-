import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import BgImgRekrutmen from "@/assets/images/Bg Img Dashboard Umkm.png";
import { Card } from "./ui/Card";
import { FiTrash } from "react-icons/fi";
import { IoLocationSharp, IoPeople } from "react-icons/io5";
import { MdStore, MdVerified } from "react-icons/md";
import { HiOutlineMenuAlt2, HiViewGridAdd } from "react-icons/hi";
import { FaGift, FaStar } from "react-icons/fa6";
import InfoBadge from "./ui/InfoBadge";
import { Button } from "@/shared/components/ui/button";
import type { IconType } from "react-icons";
import { cn } from "@/shared/lib/utils";
import { ProfileUmkmProvider, useProfileUmkm } from "./ProfileUmkmContext";
import ProfileUmkmModals from "./ProfileUmkmModals";
import { useState } from "react";

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
        variant="outline"
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
  onAction?: () => void;
  className?: string;
};

export const EmptySection = ({
  icon: Icon,
  title,
  actionLabel,
  onAction,
  className,
}: EmptySectionProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 items-center w-full text-center py-4",
      className,
    )}
  >
    <div className="h-12 w-12 bg-gray-100 flex justify-center items-center p-2 rounded-full">
      <Icon className="h-full w-full text-mint" />
    </div>
    <p className="text-sm md:text-base text-gray-400">{title}</p>
    {actionLabel && (
      <Button
        variant="mint"
        size="sm"
        className="rounded-md"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);

const SkeletonLines = ({ count = 3 }: { count?: number }) => (
  <div className="flex flex-col gap-3 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-100 rounded w-full"
        style={{ width: `${80 - i * 10}%` }}
      />
    ))}
  </div>
);

function ProfileUmkmContent() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const {
    openModal,
    namaUsaha,
    keteranganUsaha,
    lokasiUsaha,
    tahunDibangun,
    jumlahKaryawan,
    kategoriUsaha,
    logoUsaha,
    website,
    emailHrd,
    telepon,
    alamat,
    deskripsiUsaha,
    benefits,
    benefitsLoading,
    handleHapusFasilitas,
    reviews,
    reviewsLoading,
    isLoading,
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
            {/* Logo */}
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
                    <InfoBadge
                      icon={<MdStore />}
                      text={`Berdiri sejak ${tahunDibangun}`}
                    />
                    <InfoBadge
                      icon={<IoPeople />}
                      text={`${jumlahKaryawan} Karyawan`}
                    />
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
                  actionText={deskripsiUsaha ? "Ubah" : undefined}
                  onAction={() => openModal("tentang")}
                />
                {isLoading ? (
                  <SkeletonLines count={4} />
                ) : deskripsiUsaha ? (
                  <p className="text-sm md:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap text-justify">
                    {deskripsiUsaha}
                  </p>
                ) : (
                  <EmptySection
                    icon={HiOutlineMenuAlt2}
                    title="Belum ada deskripsi usaha"
                    actionLabel="Tambah Deskripsi"
                    onAction={() => openModal("tentang")}
                  />
                )}
              </Card>

              {/* Keuntungan & Fasilitas */}
              <Card>
                <SectionHeader
                  title="Keuntungan & Fasilitas"
                  actionText="Tambah"
                  onAction={() => openModal("fasilitas")}
                />
                {benefitsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 rounded-xl h-24" />
                    ))}
                  </div>
                ) : benefits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.id_benefit}
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
                        <button
                          onClick={() => setDeleteId(benefit.id_benefit)}
                          className="absolute bottom-4 right-4 opacity-50 hover:opacity-100 hover:text-red-500 cursor-pointer transition-opacity"
                          title="Hapus fasilitas"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={FaGift}
                    title="Belum ada informasi fasilitas"
                    actionLabel="Tambah Fasilitas"
                    onAction={() => openModal("fasilitas")}
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
                  {[
                    { label: "Website/Sosial Media", value: website },
                    { label: "Email Usaha", value: emailHrd },
                    { label: "Telepon", value: telepon },
                    { label: "Alamat", value: alamat },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-neutral-100 rounded-xl p-4">
                      <span className="block text-xs font-medium text-info-300 mb-1">
                        {label}
                      </span>
                      <span className="block text-sm font-medium text-gray-800 wrap-break-word">
                        {value || (
                          <span className="text-gray-400 italic">
                            Belum diisi
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/*  Kata Karyawan Kami  */}
          <Card>
            <SectionHeader title="Kata Karyawan Kami" />
            {reviewsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-40" />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-neutral-100 rounded-xl p-5 flex flex-col h-full"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "fill-warning-200"
                              : "fill-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-info-300 opacity-80 leading-relaxed mb-6 grow">
                      "{review.review_text}"
                    </p>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {review.employee_name}
                    </h4>
                  </div>
                ))}
              </div>
            ) : (
              <EmptySection
                icon={FaStar}
                title="Belum ada ulasan dari karyawan"
                className="py-8"
              />
            )}
          </Card>
        </div>
      </div>

      <ProfileUmkmModals />
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-2">Hapus Fasilitas</h3>

            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus fasilitas ini?
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Batal
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={async () => {
                  await handleHapusFasilitas(deleteId);
                  setDeleteId(null);
                }}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
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
