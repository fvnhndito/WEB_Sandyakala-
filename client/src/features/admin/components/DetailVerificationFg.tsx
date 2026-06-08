import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "@/shared/components/ui/modal";
import { useState, useEffect } from "react";
import { BiFile, BiImage, BiSolidUser } from "react-icons/bi";
import { apiRequest } from "@/shared/lib/api";

interface DocumentCardProps {
  label: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  iconType: "pdf" | "image";
  fileUrl?: string;
}

const DocumentCard = ({
  label,
  fileName,
  fileType,
  fileSize,
  uploadDate,
  iconType,
  fileUrl,
}: DocumentCardProps) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            {iconType === "pdf" ? (
              <BiFile className="text-blue-500 w-7 h-7" />
            ) : (
              <BiImage className="text-blue-400 w-7 h-7" />
            )}
          </div>

          <div className="flex flex-col">
            <h4 className="text-base font-semibold text-gray-900 break-all">
              {fileName}
            </h4>
            <p className="text-sm text-gray-500">
              {fileType} . {fileSize} . Diunggah {uploadDate}
            </p>
          </div>
        </div>

        {fileUrl && (
          <Button
            variant={"ghost"}
            size={"sm"}
            className="text-blue-800 font-semibold rounded-md shrink-0"
            onClick={() => window.open(fileUrl, "_blank")}
          >
            Lihat
          </Button>
        )}
      </div>
    </div>
  );
};

export default function DetailVerificationFg() {
  const { email = "" } = useParams<{ email: string }>();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const response = await apiRequest<any>(`/freshgraduate/detail/${email}`);
      if (response.success && response.data) {
        setProfileData(response.data);
      } else {
        // Fallback to localStorage if API fails or does not exist
        const status = localStorage.getItem(`fg_verification_status_${email}`) || "pending";
        const profileStr = localStorage.getItem(`registered_fg_profile_${email}`);
        if (profileStr) {
          try {
            const parsed = JSON.parse(profileStr);
            setProfileData({
              id: parsed.id || 1,
              fullname: parsed.fullName || "Kathryn Murphy",
              email: email,
              no_hp: parsed.phone || "081234567890",
              last_education: parsed.lastEducation || "S1 Desain Komunikasi Visual",
              status: status.toUpperCase(),
              cv_url: parsed.cv_url || "",
              ktp_url: parsed.ktp_url || "",
              portfolio_url: parsed.portfolio_url || "",
              created_at: parsed.created_at || new Date().toISOString(),
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [email]);

  const handleAccept = async () => {
    if (profileData?.id) {
      await apiRequest(`/freshgraduate/${profileData.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "APPROVED" }),
      });
    }
    // Local storage fallback
    localStorage.setItem(`fg_verification_status_${email}`, "approved");
    setOpenAccept(false);
    navigate("/admin/verifikasi-freshgraduate");
  };

  const handleReject = async () => {
    if (profileData?.id) {
      await apiRequest(`/freshgraduate/${profileData.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "REJECTED", rejection_reason: rejectionReason }),
      });
    }
    // Local storage fallback
    localStorage.setItem(`fg_verification_status_${email}`, "rejected");
    setOpen(false);
    navigate("/admin/verifikasi-freshgraduate");
  };

  if (loading) {
    return (
      <DashboardLayout title="Memuat Detail Akun..." showBackButton>
        <div className="flex justify-center py-20 text-gray-500 font-semibold">
          Memuat data profil...
        </div>
      </DashboardLayout>
    );
  }

  const isPending = profileData?.status === "PENDING" || !profileData?.status;

  return (
    <DashboardLayout title={`Detail Akun - ${profileData ? profileData.fullname : email}`} showBackButton>
      <div className="flex justify-center">
        <Card className="max-w-2xl w-full border-2 border-info-100">
          <CardHeader className="flex justify-between items-center border-b-2 border-info-100">
            <h1 className="md:text-md text-base font-bold">Informasi Akun</h1>
            {profileData?.status === "APPROVED" ? (
              <Button className="bg-green-500 text-white font-semibold rounded-full text-xs py-1.5 cursor-default hover:bg-green-500">
                Diverifikasi
              </Button>
            ) : profileData?.status === "REJECTED" ? (
              <Button className="bg-red-500 text-white font-semibold rounded-full text-xs py-1.5 cursor-default hover:bg-red-500">
                Ditolak
              </Button>
            ) : (
              <Button className="bg-orange-400 text-black font-semibold rounded-full text-xs py-1.5 cursor-default hover:bg-orange-400">
                Perlu ditinjau
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <div className="w-28 h-28 rounded-full border border-gray-400 p-1.5 shrink-0">
                <div className="w-full h-full rounded-full bg-mint flex items-center justify-center text-white overflow-hidden">
                  {profileData?.profile_pic ? (
                    <img src={profileData.profile_pic} alt={profileData.fullname} className="w-full h-full object-cover" />
                  ) : (
                    <BiSolidUser className="w-16 h-16 mt-4 opacity-90" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 w-full">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">
                    Nama Lengkap
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {profileData ? profileData.fullname : "-"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">No HP</span>
                  <span className="text-base font-semibold text-gray-900">
                    {profileData ? profileData.no_hp : "-"}
                  </span>
                </div>

                <div className="flex flex-col sm:col-span-2">
                  <span className="text-sm text-gray-500 mb-1 w-max pb-0.5">
                    Pendidikan Terakhir
                  </span>
                  <span className="text-base font-semibold text-gray-900 mt-1">
                    {profileData ? profileData.last_education : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {profileData?.cv_url && (
                <DocumentCard
                  label="DOKUMEN CV / RESUME"
                  fileName={profileData.cv_url.split("/").pop() || "CV_Resume.pdf"}
                  fileType="PDF"
                  fileSize="Dokumen"
                  uploadDate={profileData.created_at ? new Date(profileData.created_at).toLocaleDateString("id-ID") : "Baru saja"}
                  iconType="pdf"
                  fileUrl={profileData.cv_url}
                />
              )}

              {profileData?.ktp_url && (
                <DocumentCard
                  label="DOKUMEN KTP"
                  fileName={profileData.ktp_url.split("/").pop() || "KTP.png"}
                  fileType="GAMBAR"
                  fileSize="Dokumen"
                  uploadDate={profileData.created_at ? new Date(profileData.created_at).toLocaleDateString("id-ID") : "Baru saja"}
                  iconType="image"
                  fileUrl={profileData.ktp_url}
                />
              )}

              {profileData?.portfolio_url && (
                <DocumentCard
                  label="PORTFOLIO"
                  fileName={profileData.portfolio_url.split("/").pop() || "Portfolio.pdf"}
                  fileType="Dokumen"
                  fileSize="Dokumen"
                  uploadDate={profileData.created_at ? new Date(profileData.created_at).toLocaleDateString("id-ID") : "Baru saja"}
                  iconType="pdf"
                  fileUrl={profileData.portfolio_url}
                />
              )}

              {!profileData?.cv_url && !profileData?.ktp_url && !profileData?.portfolio_url && (
                <p className="text-center text-sm text-gray-400 py-4">Tidak ada dokumen yang diunggah.</p>
              )}
            </div>
          </CardBody>
          {isPending && (
            <CardFooter className="bg-info-100/30 flex gap-5 justify-between px-10 border-t-2 border-info-100">
              <Button
                onClick={() => setOpenAccept(true)}
                className="bg-info-200 border-info border text-info-300 hover:text-white hover:bg-info font-semibold w-1/2"
              >
                Terima
              </Button>
              <Button
                onClick={() => setOpen(true)}
                className="bg-red-200 border hover:bg-red-500 hover:text-white border-red-500 text-red-500 font-semibold w-1/2"
              >
                Tolak
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Modal Tolak */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <h1 className="text-center text-xl font-bold mb-4">
            Anda yakin ingin menolak pengajuan ini ?
          </h1>

          <form onSubmit={(e) => { e.preventDefault(); handleReject(); }}>
            <label className="text-sm font-bold mb-2.5 inline-block">
              Pesan Penolakan :
            </label>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-28 border-2 border-slate-300 rounded-md p-2 text-sm outline-none resize-none"
              required
            />
            
            <div className="flex justify-end mt-4">
              <Button type="submit" className="bg-secondary px-7 py-1 rounded-md text-white font-semibold">Kirim</Button>
            </div>
          </form>
        </Modal>

        {/* Modal Terima */}
        <Modal open={openAccept} onClose={() => setOpenAccept(false)}>
          <h1 className="text-center text-xl font-bold mb-4">
            Anda yakin ingin menerima pengajuan ini ?
          </h1>

          <p className="text-center text-sm text-gray-600 mb-6">
            Dengan menerima pengajuan ini, akun Fresh Graduate <strong>{profileData?.fullname}</strong> akan diverifikasi dan berhak melamar lowongan di platform.
          </p>

          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => setOpenAccept(false)}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold px-7 py-1.5 rounded-md"
            >
              Batal
            </Button>
            <Button onClick={handleAccept} className="bg-info text-white hover:bg-blue-700 font-semibold px-7 py-1.5 rounded-md">
              Terima Pengajuan
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
