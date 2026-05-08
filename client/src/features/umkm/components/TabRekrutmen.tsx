import {
  daftarLowongan,
  jadwalWawancara,
  lamaranTerbaru,
} from "../constants/mock-data";
import { cn } from "@/shared/lib/utils";
import { getBadgeStyle } from "../utils/badge-style";
import { Card, CardHeader } from "./ui/Card";
import { IoIosPeople } from "react-icons/io";
import { Button } from "@/shared/components/ui/button";
import { GoCalendar } from "react-icons/go";
import { FiPlus } from "react-icons/fi";

const EmptyDataLamaran = () => {
  return (
    <>
      <div className="w-17 h-17 p-2 bg-neutral-200 rounded-full flex items-center justify-center mx-auto">
        <IoIosPeople className="fill-mint w-full h-full" />
      </div>
      <h3 className="font-bold text-center text-lg my-4">Belum ada pelamar</h3>
      <p className="mb-4 text-center text-sm text-gray-500">
        Daftar pelamar akan muncul di sini setelah Anda mempublikasikan lowongan
      </p>

      <Button
        className="text-mint border-mint hover:bg-mint hover:text-mint-300
                     bg-mint-100 border rounded-md w-max mx-auto"
        size={"sm"}
      >
        Buat Lowongan
      </Button>
    </>
  );
};

const EmptyDataWawancara = () => {
  return (
    <div className="flex items-center gap-5">
      <div className="h-18 w-18 aspect-square p-4 bg-neutral-100 rounded-full">
        <GoCalendar className="w-full h-full fill-mint" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-sm">Belum ada jadwal wawancara</h3>
        <p className="text-xs text-gray-300">
          Yuk, mulai seleksi pelamar untuk mengatur jadwal wawancara pertamamu!
        </p>
      </div>
    </div>
  );
};

const EmptyDataLowongan = () => {
  return (
    <div className="border border-dashed border-neutral-300 flex flex-col items-center justify-center rounded-md">
      <Button className="w-17 h-17 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center mx-auto mt-5">
        <FiPlus className="text-mint w-full h-full" />
      </Button>
      <h3 className="font-bold text-sm mb-1 mt-3">Tambah Posisi Pertama</h3>
      <p className="text-xs text-gray-300 mb-3">Belum ada posisi yang dibuka</p>
    </div>
  );
};

export default function TabRekrutmen() {
  return (
    <section className="container mx-auto px-4 md:px-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader
              title="Lamaran Terbaru"
              linkTitle="Seleksi Pelamar"
              to={"/umkm/dashboard/lamaran-masuk"}
            />

            <div className="flex flex-col">
              {lamaranTerbaru.length > 0 ? (
                lamaranTerbaru.map((item) => (
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
                ))
              ) : (
                // Not found data
                <EmptyDataLamaran />
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card>
            <CardHeader
              title="Jadwal Wawancara"
              linkTitle="Lihat Wawancara"
              to={"/umkm/dashboard/dalam-seleksi"}
            />

            <div className="flex flex-col gap-3">
              {jadwalWawancara.length > 0 ? (
                jadwalWawancara.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-100 rounded-xl py-4 px-6 flex justify-between items-center border border-gray-50"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800 text-xs md:text-base">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-xs">{item.role}</p>
                      <p className="text-gray-400 text-xs">{item.project}</p>
                    </div>
                    <span className="bg-red-200 text-red-600 px-3 py-1 rounded-full text-xs font-base">
                      {item.date}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyDataWawancara />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Daftar Lowongan"
              linkTitle="Lihat Lowongan"
              to={"/umkm/dashboard/posisi-terbuka"}
            />

            <div className="flex flex-col">
              {daftarLowongan.length > 0 ? (
                daftarLowongan.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-4 border-b border-gray-800 last:border-0"
                  >
                    <div>
                      <h3 className="font-bold text-black text-xs md:text-base">
                        {item.role}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-xs mt-0.5">
                        {item.type}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={cn(
                          "px-4 py-1 rounded-full text-[11px] md:text-xs font-semibold border",
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
                ))
              ) : (
                <EmptyDataLowongan />
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
