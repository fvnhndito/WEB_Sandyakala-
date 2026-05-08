import DataTaskLayout from "@/shared/layouts/DataTaskLayout";
import { useTask } from "@/pages/umkm/TaskContext";

const tabs = [
  {
    label: "Lamaran Masuk",
    path: "/umkm/dashboard/lamaran-masuk",
    key: "lamaranMasuk",
  },
  {
    label: "Dalam Seleksi",
    path: "/umkm/dashboard/dalam-seleksi",
    key: "dalamSeleksi",
  },
  {
    label: "Posisi Terbuka",
    path: "/umkm/dashboard/posisi-terbuka",
    key: "posisiTerbuka",
  },
];

export default function DataDalamSeleksi() {
  const { wawancaraList } = useTask();

  return (
    <DataTaskLayout
      title="Wawancara Pelamar"
      description="Lihat semua wawancara pelamar dalam satu tampilan"
      activeTab="dalamSeleksi"
      tabs={tabs}
      statusOptions={["Wawancara"]}
    >
      <div className="w-full px-6">
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full table-auto border-collapse text-sm text-neutral-900">
            <thead>
              <tr className="bg-mint/15 text-center">
                <th className="border px-3 py-2">No</th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Nama Pelamar
                </th>
                <th className="border px-3 py-2">Posisi</th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Pendidikan Terakhir
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  No Handphone
                </th>
                <th className="border px-3 py-2 whitespace-nowrap">
                  Jadwal Interview
                </th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {wawancaraList.length > 0 ? (
                wawancaraList.map((p, index) => (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-100 transition text-center text-xs"
                  >
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2 font-semibold whitespace-nowrap">
                      {p.nama_pelamar}
                    </td>
                    <td className="border px-3 py-2">{p.posisi_pelamar}</td>
                    <td className="border px-3 py-2">
                      {p.pendidikan_terakhir_pelamar}
                    </td>
                    <td className="border px-3 py-2">{p.kontak_pelamar}</td>
                    <td className="border px-3 py-2 whitespace-nowrap">
                      <span className="block">
                        {new Date(p.tanggal_wawancara).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="text-neutral-500">
                        {p.waktu_mulai_wawancara} - {p.waktu_selesai_wawancara}
                      </span>
                    </td>
                    <td className="border px-3 py-2">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-neutral-200 text-neutral-700">
                        {p.status_wawancara}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-neutral-500">
                    Tidak ada data wawancara
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DataTaskLayout>
  );
}
