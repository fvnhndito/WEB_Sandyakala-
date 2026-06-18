import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type ModalKey = "profile" | "tentang" | "kontak" | "fasilitas";

export type Benefit = {
  id_benefit: number;
  id_umkm: number;
  title: string;
  description: string;
};

export type Review = {
  id: number;
  umkm_id: number;
  employee_name: string;
  review_text: string;
  rating: number;
  created_at: string;
};

type ProfileUmkmContextType = {
  modalState: any;
  benefits: Benefit[];
  reviews: Review[];
  umkmId: number | null;
  isLoading: boolean;
  [key: string]: any;
};

const ProfileUmkmContext = createContext<ProfileUmkmContextType | null>(null);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_BASE = `${BASE_URL}/umkm`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function ProfileUmkmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalState, setModalState] = useState<Record<ModalKey, boolean>>({
    profile: false,
    tentang: false,
    kontak: false,
    fasilitas: false,
  });

  const openModal = (key: ModalKey) =>
    setModalState((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key: ModalKey) =>
    setModalState((prev) => ({ ...prev, [key]: false }));

  const userStr = localStorage.getItem("user");
  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error(error);
  }
  const userEmail = user?.email || "";
  const profileKey = userEmail
    ? `registered_umkm_profile_${userEmail}`
    : "registered_umkm_profile";

  const savedProfileStr = localStorage.getItem(profileKey);

  let savedProfile = null;

  try {
    savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
  } catch (error) {
    console.error(error);
  }

  const [umkmId, setUmkmId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile
  const [namaUsaha, setNamaUsaha] = useState(
    savedProfile?.businessName || "Sambal Bakar Nusantara",
  );
  const [keteranganUsaha, setKeteranganUsaha] = useState(
    savedProfile
      ? `${savedProfile.businessCategory} Nusantara`
      : "Kuliner Nusantara Modern",
  );
  const [lokasiUsaha, setLokasiUsaha] = useState(
    savedProfile?.address || "Jakarta Selatan",
  );
  const [tahunDibangun, setTahunDibangun] = useState(
    savedProfile?.establishedAt || "2022",
  );
  const [jumlahKaryawan, setJumlahKaryawan] = useState(
    savedProfile?.employeeCount || "10 - 50",
  );
  const [kategoriUsaha, setKategoriUsaha] = useState(
    savedProfile?.businessCategory || "Kuliner",
  );
  const [website, setWebsite] = useState(
    savedProfile
      ? savedProfile.websiteSosmed || ""
      : "www.sambalbakarnusantara.com",
  );
  const [emailHrd, setEmailHrd] = useState(
    savedProfile?.businessEmail || "hrd@sambalbakar.id",
  );
  const [telepon, setTelepon] = useState(
    savedProfile?.businessPhone || "+62 812-3456-7890",
  );
  const [alamat, setAlamat] = useState(
    savedProfile?.address || "Jl. Kemang Raya No. 45, Jaksel",
  );
  const [logoUsaha, setLogoUsaha] = useState(savedProfile?.businessLogo || "");

  // Tentang Kami
  const [deskripsiUsaha, setDeskripsiUsaha] = useState("");
  const [deskripsiError, setDeskripsiError] = useState("");
  const [isSavingDeskripsi, setIsSavingDeskripsi] = useState(false);

  // Benefits
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(true);
  const [judulFasilitas, setJudulFasilitas] = useState("");
  const [deskripsiFasilitas, setDeskripsiFasilitas] = useState("");
  const [benefitErrors, setBenefitErrors] = useState({
    title: "",
    description: "",
  });
  const [isSavingBenefit, setIsSavingBenefit] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/my-profile`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const p = json.data;
        setUmkmId(p.id_umkm);
        setNamaUsaha(p.business_name || namaUsaha);
        setKeteranganUsaha(p.business_category || keteranganUsaha);
        setLokasiUsaha(p.regency || lokasiUsaha);
        setTahunDibangun(String(p.established_at || tahunDibangun));
        setJumlahKaryawan(p.employee_count || jumlahKaryawan);
        setKategoriUsaha(p.business_category || kategoriUsaha);
        setWebsite(p.website_sosmed || website);
        setEmailHrd(p.business_email || emailHrd);
        setTelepon(p.business_phone || telepon);
        setAlamat(p.subdistrict || alamat);
        setLogoUsaha(p.logo_url || "");
        setDeskripsiUsaha(p.description || "");
      }
    } catch (err) {
      console.error("Gagal memuat profil:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBenefits = useCallback(async () => {
    try {
      setBenefitsLoading(true);
      const res = await fetch(`${API_BASE}/benefits`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) setBenefits(json.data || []);
    } catch (err) {
      console.error("Gagal memuat fasilitas:", err);
    } finally {
      setBenefitsLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await fetch(`${API_BASE}/reviews`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) setReviews(json.data || []);
    } catch (err) {
      console.error("Gagal memuat ulasan:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      const timer = setTimeout(() => {
        const retryToken = localStorage.getItem("accessToken");
        if (retryToken) {
          fetchProfile();
          fetchBenefits();
          fetchReviews();
        }
      }, 500);
      return () => clearTimeout(timer);
    }

    fetchProfile();
    fetchBenefits();
    fetchReviews();
  }, [fetchProfile, fetchBenefits, fetchReviews]);

  useEffect(() => {
    if (!profileKey) return;

    let currentProfile = {};

    try {
      const currentProfileStr = localStorage.getItem(profileKey);
      currentProfile = currentProfileStr ? JSON.parse(currentProfileStr) : {};
    } catch (error) {
      console.error(error);
    }

    localStorage.setItem(
      profileKey,
      JSON.stringify({
        ...currentProfile,
        businessName: namaUsaha,
        businessCategory: kategoriUsaha,
        employeeCount: jumlahKaryawan,
        establishedAt: tahunDibangun,
        businessEmail: emailHrd,
        businessPhone: telepon,
        websiteSosmed: website,
        address: alamat,
        businessLogo: logoUsaha,
      }),
    );
  }, [
    namaUsaha,
    kategoriUsaha,
    jumlahKaryawan,
    tahunDibangun,
    emailHrd,
    telepon,
    website,
    alamat,
    logoUsaha,
    profileKey,
  ]);

  // Validasi & save deskripsi
  const handleSaveDeskripsi = async () => {
    setDeskripsiError("");

    if (!deskripsiUsaha.trim()) {
      setDeskripsiError("Deskripsi usaha wajib diisi");
      return;
    }
    if (deskripsiUsaha.trim().length < 20) {
      setDeskripsiError("Deskripsi minimal 20 karakter");
      return;
    }
    if (deskripsiUsaha.trim().length > 2000) {
      setDeskripsiError("Deskripsi maksimal 2000 karakter");
      return;
    }

    try {
      setIsSavingDeskripsi(true);
      const res = await fetch(`${API_BASE}/description`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ description: deskripsiUsaha.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setDeskripsiError(json.message || "Gagal menyimpan deskripsi");
        return;
      }
      closeModal("tentang");
    } catch {
      setDeskripsiError("Terjadi kesalahan jaringan");
    } finally {
      setIsSavingDeskripsi(false);
    }
  };

  // Validasi & tambah benefit
  const handleTambahFasilitas = async () => {
    const errors = { title: "", description: "" };
    let hasError = false;

    if (!judulFasilitas.trim()) {
      errors.title = "Judul fasilitas wajib diisi";
      hasError = true;
    } else if (judulFasilitas.trim().length < 3) {
      errors.title = "Judul minimal 3 karakter";
      hasError = true;
    } else if (judulFasilitas.trim().length > 100) {
      errors.title = "Judul maksimal 100 karakter";
      hasError = true;
    }

    if (deskripsiFasilitas.trim().length > 500) {
      errors.description = "Deskripsi maksimal 500 karakter";
      hasError = true;
    }

    setBenefitErrors(errors);
    if (hasError) return;

    try {
      setIsSavingBenefit(true);
      const res = await fetch(`${API_BASE}/benefits`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: judulFasilitas.trim(),
          description: deskripsiFasilitas.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setBenefitErrors((prev) => ({
          ...prev,
          title: json.message || "Gagal menambah fasilitas",
        }));
        return;
      }
      setBenefits((prev) => [...prev, json.data]);
      setJudulFasilitas("");
      setDeskripsiFasilitas("");
      setBenefitErrors({ title: "", description: "" });
      closeModal("fasilitas");
    } catch {
      setBenefitErrors((prev) => ({
        ...prev,
        title: "Terjadi kesalahan jaringan",
      }));
    } finally {
      setIsSavingBenefit(false);
    }
  };

  // Hapus benefit
  const handleHapusFasilitas = async (id: number) => {
    setBenefits((prev) => prev.filter((b) => b.id_benefit !== id));
    try {
      const res = await fetch(`${API_BASE}/benefits/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        await fetchBenefits();
      }
    } catch {
      await fetchBenefits();
    }
  };

  return (
    <ProfileUmkmContext.Provider
      value={{
        modalState,
        openModal,
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
        logoUsaha,
        setLogoUsaha,
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
        benefits,
        benefitsLoading,
        judulFasilitas,
        setJudulFasilitas,
        deskripsiFasilitas,
        setDeskripsiFasilitas,
        benefitErrors,
        isSavingBenefit,
        handleTambahFasilitas,
        handleHapusFasilitas,
        reviews,
        reviewsLoading,
        umkmId,
        isLoading,
      }}
    >
      {children}
    </ProfileUmkmContext.Provider>
  );
}

export const useProfileUmkm = () => {
  const ctx = useContext(ProfileUmkmContext);
  if (!ctx)
    throw new Error("useProfileUmkm must be used inside ProfileUmkmProvider");
  return ctx;
};
