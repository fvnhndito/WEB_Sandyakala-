import { useEffect, useState } from "react";
import { useProfileUmkm } from "./ProfileUmkmContext";
import ProfileModal from "@/shared/components/ui/modal-profile";

function FieldError({ message }: { message: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function CharCount({ current, max }: { current: number; max: number }) {
  const isNear = current > max * 0.8;
  const isOver = current > max;
  return (
    <span
      className={`text-xs mt-1 block text-right ${
        isOver ? "text-red-500" : isNear ? "text-amber-500" : "text-gray-400"
      }`}
    >
      {current} / {max}
    </span>
  );
}

export default function ProfileUmkmModals() {
  const {
    modalState,
    closeModal,
    namaUsaha,
    setNamaUsaha,
    keteranganUsaha,
    setKeteranganUsaha,
    lokasiUsaha,
    setLokasiUsaha,
    tahunDibangun,
    setTahunDibangun,
    jumlahKaryawan,
    setJumlahKaryawan,
    kategoriUsaha,
    setKategoriUsaha,
    website,
    setWebsite,
    emailHrd,
    setEmailHrd,
    telepon,
    setTelepon,
    alamat,
    setAlamat,
    deskripsiUsaha,
    setDeskripsiUsaha,
    deskripsiError,
    isSavingDeskripsi,
    handleSaveDeskripsi,
    judulFasilitas,
    setJudulFasilitas,
    deskripsiFasilitas,
    setDeskripsiFasilitas,
    benefitErrors,
    isSavingBenefit,
    handleTambahFasilitas,
  } = useProfileUmkm();

  const [selectedKategori, setSelectedKategori] = useState("");
  const [customKategori, setCustomKategori] = useState("");
  const [provinsi, setProvinsi] = useState<any[]>([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState<any[]>([]);

  // Provinsi
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then(setProvinsi);
  }, []);

  const handleProvinsi = async (id: string) => {
    setSelectedProvinsi(id);
    setKabupaten([]);
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`,
      );
      setKabupaten(await res.json());
    } catch {
      console.error("Gagal mengambil kabupaten");
    }
  };

  const handleCloseFasilitas = () => {
    setJudulFasilitas("");
    setDeskripsiFasilitas("");
    closeModal("fasilitas");
  };

  const handleCloseTentang = () => {
    closeModal("tentang");
  };

  return (
    <>
      {/* Edit Profile */}
      {modalState.profile && (
        <ProfileModal
          title="Edit Profile UMKM"
          onClose={() => closeModal("profile")}
          onSubmit={() => closeModal("profile")}
          submitLabel="Simpan"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-neutral-700 block mb-1">Nama Usaha</label>
              <input
                type="text"
                value={namaUsaha}
                onChange={(e) => setNamaUsaha(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-700 block mb-1">Keterangan Usaha</label>
              <input
                type="text"
                value={keteranganUsaha}
                onChange={(e) => setKeteranganUsaha(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-700 block mb-1">Provinsi</label>
                <select
                  value={selectedProvinsi}
                  onChange={(e) => handleProvinsi(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinsi.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-700 block mb-1">Kabupaten / Kota</label>
                <select
                  value={lokasiUsaha}
                  onChange={(e) => setLokasiUsaha(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
                >
                  <option value="">Pilih Kabupaten/Kota</option>
                  {kabupaten.map((item: any) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-neutral-700 block mb-1">Tahun Dibangun</label>
              <input
                type="number"
                value={tahunDibangun}
                onChange={(e) => setTahunDibangun(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-700 block mb-1">Jumlah Karyawan</label>
              <select
                value={jumlahKaryawan}
                onChange={(e) => setJumlahKaryawan(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
              >
                <option value="" disabled>Pilih jumlah karyawan</option>
                <option value="1 - 10">1 - 10 Karyawan (Usaha Mikro)</option>
                <option value="11 - 50">11 - 50 Karyawan (Usaha Kecil)</option>
                <option value="51 - 100">51 - 100 Karyawan (Usaha Menengah)</option>
                <option value="100+">100+ Karyawan (Usaha Besar)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-700 block mb-1">Kategori Usaha</label>
              <select
                value={kategoriUsaha}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedKategori(value);
                  if (value !== "lainnya") setKategoriUsaha(value);
                  else setKategoriUsaha("");
                }}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
              >
                <option value="">Pilih Kategori Usaha</option>
                <option value="Kuliner">Kuliner (Makanan & Minuman)</option>
                <option value="Fashion & Pakaian">Fashion & Pakaian</option>
                <option value="Jasa & Layanan">Jasa & Layanan Profesional</option>
                <option value="Perdagangan/Ritel">Perdagangan/Ritel</option>
                <option value="Teknologi & Digital">Teknologi & Digital</option>
                <option value="Kesehatan & Kecantikan">Kesehatan & Kecantikan</option>
                <option value="Agribisnis">Agribisnis</option>
                <option value="Manufaktur & Produksi">Manufaktur & Produksi</option>
                <option value="Pariwisata & Hiburan">Pariwisata & Hiburan</option>
                <option value="lainnya">Lainnya</option>
              </select>
              {selectedKategori === "lainnya" && (
                <input
                  type="text"
                  placeholder="Tulis kategori usaha"
                  value={customKategori}
                  onChange={(e) => {
                    setCustomKategori(e.target.value);
                    setKategoriUsaha(e.target.value);
                  }}
                  className="w-full mt-3 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        </ProfileModal>
      )}

      {/* Tentang Kami */}
      {modalState.tentang && (
        <ProfileModal
          title="Edit Tentang Kami"
          onClose={handleCloseTentang}
          onSubmit={handleSaveDeskripsi}
          submitLabel={isSavingDeskripsi ? "Menyimpan..." : "Simpan"}
          isSubmitting={isSavingDeskripsi}
        >
          <div>
            <label className="text-sm text-neutral-700 block mb-1">
              Deskripsi Usaha
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              value={deskripsiUsaha}
              onChange={(e) => setDeskripsiUsaha(e.target.value)}
              rows={6}
              placeholder="Ceritakan tentang usaha Anda: latar belakang, visi, keunggulan produk/layanan..."
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none transition-colors ${
                deskripsiError
                  ? "border-red-400 focus:ring-red-300"
                  : "border-neutral-200 focus:ring-neutral-300"
              }`}
            />
            <div className="flex justify-between items-start mt-1">
              <FieldError message={deskripsiError} />
              <CharCount current={deskripsiUsaha.length} max={2000} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Minimal 20 karakter</p>
          </div>
        </ProfileModal>
      )}

      {/* Kontak */}
      {modalState.kontak && (
        <ProfileModal
          title="Edit Kontak Kami"
          onClose={() => closeModal("kontak")}
          onSubmit={() => closeModal("kontak")}
          submitLabel="Simpan"
        >
          <div className="flex flex-col gap-4">
            {[
              { label: "Website/Sosial Media", value: website, onChange: setWebsite, type: "text" },
              { label: "Email Usaha", value: emailHrd, onChange: setEmailHrd, type: "email" },
              { label: "Telepon", value: telepon, onChange: setTelepon, type: "text" },
              { label: "Alamat", value: alamat, onChange: setAlamat, type: "text" },
            ].map(({ label, value, onChange, type }) => (
              <div key={label}>
                <label className="text-sm text-neutral-700 block mb-1">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
                />
              </div>
            ))}
          </div>
        </ProfileModal>
      )}

      {/* Tambah Fasilitas */}
      {modalState.fasilitas && (
        <ProfileModal
          title="Tambah Fasilitas"
          onClose={handleCloseFasilitas}
          onSubmit={handleTambahFasilitas}
          submitLabel={isSavingBenefit ? "Menyimpan..." : "Tambah"}
          isSubmitting={isSavingBenefit}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-neutral-700 block mb-1">
                Judul Fasilitas
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={judulFasilitas}
                onChange={(e) => setJudulFasilitas(e.target.value)}
                placeholder="contoh: Gaji Kompetitif"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors ${
                  benefitErrors.title
                    ? "border-red-400 focus:ring-red-300"
                    : "border-neutral-200 focus:ring-neutral-300"
                }`}
              />
              <div className="flex justify-between items-start">
                <FieldError message={benefitErrors.title} />
                <CharCount current={judulFasilitas.length} max={100} />
              </div>
            </div>

            <div>
              <label className="text-sm text-neutral-700 block mb-1">Deskripsi</label>
              <textarea
                value={deskripsiFasilitas}
                onChange={(e) => setDeskripsiFasilitas(e.target.value)}
                placeholder="contoh: Gaji pokok + bonus performa bulanan"
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none transition-colors ${
                  benefitErrors.description
                    ? "border-red-400 focus:ring-red-300"
                    : "border-neutral-200 focus:ring-neutral-300"
                }`}
              />
              <div className="flex justify-between items-start">
                <FieldError message={benefitErrors.description} />
                <CharCount current={deskripsiFasilitas.length} max={500} />
              </div>
            </div>
          </div>
        </ProfileModal>
      )}
    </>
  );
}
