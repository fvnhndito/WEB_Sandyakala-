import { Link, NavLink } from "react-router-dom";
import ImgHero from "@/assets/images/Bg Image Home UMKM.png";
import { IoIosArrowRoundForward } from "react-icons/io";
import type { IconType } from "react-icons";
import { Button } from "@/shared/components/ui/button";
import { FiPlus, FiUser } from "react-icons/fi";
import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import { dataCardBisnis } from "../constants/mock-data";
import { DetailPekerjaContent } from "./DetailPekerjaContent";
import { useState, useEffect } from "react";
import { ModalPekerja } from "@/shared/components/ui/modal-pekerja";
import type { Employee } from "@/features/umkm/types/dashboard.types";
import { apiRequest } from "@/shared/lib/api";

interface CardBisnisProps {
  title: string;
  description: string;
  Icon: IconType;
  link: string;
}

const CardBisnis = ({ title, description, Icon, link }: CardBisnisProps) => {
  return (
    <div className="flex flex-col py-2.5 px-4 rounded-xl bg-white shadow-md">
      <div className="bg-mint-100/50 rounded-lg p-3 w-max">
        <Icon className="h-10 w-10 fill-mint" />
      </div>
      <div className="my-4">
        <h5 className="mb-1.5 text-xl font-bold">{title}</h5>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <Link to={link} className="w-full flex justify-end">
        <IoIosArrowRoundForward className="h-10 w-10 fill-mint" />
      </Link>
    </div>
  );
};

const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div>
      <h5 className="uppercase font-semibold text-xs text-mint-200 mb-1.5">
        {title}
      </h5>
      <h3 className="font-bold text-xl">{description}</h3>
    </div>
  );
};

export default function HomeUmkm() {
  const token = localStorage.getItem("accessToken");

  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  useEffect(() => {
    if (token) {
      fetchWorkers();
    } else {
      setLoadingWorkers(false);
    }
  }, [token]);

  const fetchWorkers = async () => {
    try {
      setLoadingWorkers(true);

      if (!token) return;

      const res = await apiRequest<any>("/applications/umkm/workers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.success || !res.data) {
        setEmployeeList([]);
        return;
      }

      const workers = Array.isArray(res.data) ? res.data : [];

      const mapped: Employee[] = workers.map((w: any) => ({
        id: String(w.application_id),
        nama_pekerja: w.nama_pekerja,
        posisi_pekerja: w.posisi_pekerja,
        jenis_penugasan_pekerja:
          w.jenis_penugasan === "PROJECT" ? "Berbasis Proyek" : "Shift Harian",
        no_hp_pekerja: w.no_hp,
        tanggal_masuk_pekerja: w.tanggal_masuk,
        status_pekerja: w.status_pekerja ?? "Aktif",
        foto_pekerja: w.profile_pic ?? "",
      }));

      setEmployeeList(mapped);
    } catch (error) {
      console.error("Gagal memuat data pekerja:", error);
      setEmployeeList([]);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleUpdateStatus = (id: string, status: "Aktif" | "Nonaktif") => {
    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, status_pekerja: status } : emp,
      ),
    );

    setSelectedEmployee((prev) =>
      prev?.id === id ? { ...prev, status_pekerja: status } : prev,
    );
  };

  const activeWorkers = employeeList
    .filter((worker) => worker.status_pekerja === "Aktif")
    .slice(0, 5);

  return (
    <DashboardUmkmLayout>
      <section
        className="bg-cover bg-center flex items-center min-h-screen relative pt-20"
        style={{ backgroundImage: `url(${ImgHero})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <h1 className="text-2xl md:text-4xl xl:text-5xl font-extrabold mb-4 text-white leading-tight">
              Tumbuh Bersama Talenta Muda Hebat Indonesia
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-100 mb-6 leading-relaxed">
              Berikan kesempatan proyek nyata bagi first-jobber, dan dapatkan
              bantuan operasional yang efisien untuk memajukan bisnis mikro
              Anda. Jangan khawatir, kolaborasi pasti aman dan progres dapat
              dipantau.
            </p>
            <NavLink
              to="/umkm/add-lowongan"
              className="px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base inline-block bg-white rounded-full text-mint font-base shadow-lg hover:bg-mint-200 hover:text-white transition-all"
            >
              Mulai Kolaborasi
            </NavLink>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <Header title="Akses Cepat" description="Kelola Bisnis Anda" />
        <div className="my-7 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {dataCardBisnis.map((item) => (
            <CardBisnis
              key={item.title}
              title={item.title}
              description={item.description}
              Icon={item.Icon}
              link={item.link}
            />
          ))}
        </div>
      </section>

      <section className="container py-10">
        <div className="flex items-center justify-between">
          <Header title="Tim Pekerja" description="Pekerja Aktif" />
          <Link
            to="/umkm/dashboard/data-pekerja"
            className="border-mint hover:bg-mint-200 hover:text-mint-300 transition-all duration-100 border rounded-md px-4 py-2 text-mint text-sm font-semibold"
          >
            Lihat Selengkapnya
          </Link>
        </div>

        <div className="grid my-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {loadingWorkers ? (
            <p className="text-gray-400 text-sm col-span-3 text-center py-6">
              Memuat data pekerja...
            </p>
          ) : activeWorkers.length > 0 ? (
            <>
              {activeWorkers.map((employee) => (
                <div
                  key={employee.id}
                  className="p-4 shadow-md flex flex-col rounded-xl bg-white"
                >
                  <div className="flex gap-3 items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0">
                      {employee.foto_pekerja ? (
                        <img
                          src={employee.foto_pekerja}
                          alt="Profile Pekerja"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-2xl text-blue-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg">
                        {employee.nama_pekerja}
                      </h4>
                      <p className="text-gray-400">{employee.posisi_pekerja}</p>
                    </div>
                  </div>
                  <Button
                    className="bg-mint-100 text-info-300 hover:text-white w-max font-medium mt-5 px-6 py-1"
                    size="sm"
                  >
                    {employee.jenis_penugasan_pekerja}
                  </Button>
                  <div className="flex justify-between items-center mb-5 mt-9">
                    <p className="text-xs text-gray-400">
                      Bergabung{" "}
                      {employee.tanggal_masuk_pekerja
                        ? new Date(
                            employee.tanggal_masuk_pekerja,
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setOpen(true);
                      }}
                      className="p-2 border border-mint text-mint font-semibold text-xs rounded-md hover:bg-mint-200 hover:text-mint-300 transition-all duration-100 cursor-pointer"
                    >
                      Profil Pekerja
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Kalau belum ada pekerja, tampilkan hanya card tambah pekerja
            <p className="text-gray-400 text-sm col-span-3 text-center py-6">
              Belum ada pekerja aktif. Terima pelamar dari tab wawancara.
            </p>
          )}

          <Link
            to="/umkm/dashboard/lamaran-masuk"
            className="border border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 gap-7"
          >
            <div className="h-18 w-18 rounded-full bg-mint-100 flex justify-center items-center">
              <FiPlus className="w-10 h-10 text-mint" />
            </div>
            <div className="space-y-1 text-center">
              <h4 className="text-xl font-bold">Tambah Pekerja</h4>
              <p className="text-xs text-gray-500">
                Seleksi Pelamar yang Melamar di UMKM Anda
              </p>
            </div>
          </Link>
        </div>

        <ModalPekerja
          open={open}
          onClose={() => setOpen(false)}
          title="Detail Pekerja"
          status={selectedEmployee?.status_pekerja}
        >
          {selectedEmployee && (
            <DetailPekerjaContent
              employee={selectedEmployee}
              onClose={() => setOpen(false)}
              onUpdateStatusPekerja={handleUpdateStatus}
            />
          )}
        </ModalPekerja>
      </section>
    </DashboardUmkmLayout>
  );
}
