import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { SearchInput } from "@/shared/components/ui/search-input";
import { StatCard } from "@/shared/components/ui/stat-card";
import { Link } from "react-router-dom";
// import { apiRequest } from "@/shared/lib/api";

type StatusType = "pending" | "approved" | "rejected";
type FilterType = "semua" | StatusType;

interface FgProfile {
  id: string;
  fullName: string;
  phone: string;
  lastEducation: string;
  status: StatusType;
  email: string;
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "Semua", value: "semua" },
  { label: "Menunggu", value: "pending" },
  { label: "Diverifikasi", value: "approved" },
  { label: "Ditolak", value: "rejected" },
];

const STATUS_LABEL: Record<StatusType, string> = {
  pending: "Menunggu",
  approved: "Diverifikasi",
  rejected: "Ditolak",
};

type BadgeVariant = "warning" | "primary" | "error";

const DUMMY_PROFILES: FgProfile[] = [
  {
    id: "1",
    fullName: "Kathryn Murphy",
    phone: "08123456789",
    lastEducation: "S1 Desain Komunikasi Visual",
    status: "approved",
    email: "kathryn@mail.com",
  },
  {
    id: "2",
    fullName: "Devon Lane",
    phone: "081234567890",
    lastEducation: "S1 Teknik Informatika",
    status: "rejected",
    email: "devon@mail.com",
  },
];

const STATUS_BADGE_VARIANT: Record<StatusType, BadgeVariant> = {
  pending: "warning",
  approved: "primary",
  rejected: "error",
};

export default function VerificationFg() {
  const [registeredProfiles, setRegisteredProfiles] = useState<FgProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("semua");

  useEffect(() => {
    setRegisteredProfiles(DUMMY_PROFILES);
    // const fetchProfiles = async () => {
    //   const response = await apiRequest<any[]>("/fresh-graduate");
    //   if (response.success && response.data) {
    //     const mapped: FgProfile[] = response.data.map((p: any) => ({
    //       id: p.id_fg,
    //       fullName: p.full_name,
    //       phone: p.phone,
    //       lastEducation: p.last_education,
    //       status: (p.status?.toLowerCase() as StatusType) || "pending",
    //       email: p.email,
    //     }));
    //     setRegisteredProfiles(DUMMY_PROFILES);
    //   } else {
    //     // Fallback localStorage
    //     let savedEmailsStr = localStorage.getItem("registered_fg_emails");
    //     let emails: string[] = [];
    //     if (savedEmailsStr) {
    //       try {
    //         const parsed = JSON.parse(savedEmailsStr);
    //         if (Array.isArray(parsed)) emails = parsed;
    //       } catch {
    //         emails = [];
    //       }
    //     }

    //     const latestEmail = localStorage.getItem("latest_registered_fg_email");
    //     if (latestEmail && !emails.includes(latestEmail)) {
    //       emails.push(latestEmail);
    //     }

    //     const profiles: FgProfile[] = [];
    //     const seenEmails = new Set<string>();

    //     emails.forEach((email) => {
    //       if (seenEmails.has(email)) return;
    //       seenEmails.add(email);

    //       const profileStr = localStorage.getItem(`registered_fg_profile_${email}`);
    //       const status =
    //         (localStorage.getItem(`fg_verification_status_${email}`) as StatusType) || "pending";
    //       if (profileStr) {
    //         try {
    //           const profile = JSON.parse(profileStr);
    //           profiles.push({ ...profile, email, status });
    //         } catch (e) {
    //           console.error("Error parsing profile for email", email, e);
    //         }
    //       }
    //     });
    //     setRegisteredProfiles(profiles);
    //   }
    // };
    // fetchProfiles();
  }, []);

  const stats = useMemo(
    () => ({
      total: registeredProfiles.length,
      pending: registeredProfiles.filter((p) => p.status === "pending").length,
      approved: registeredProfiles.filter((p) => p.status === "approved").length,
      rejected: registeredProfiles.filter((p) => p.status === "rejected").length,
    }),
    [registeredProfiles]
  );

  const filteredProfiles = useMemo(() => {
    return registeredProfiles.filter((profile) => {
      const matchesFilter =
        activeFilter === "semua" || profile.status === activeFilter;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        profile.fullName?.toLowerCase().includes(query) ||
        profile.phone?.toLowerCase().includes(query) ||
        profile.lastEducation?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [registeredProfiles, activeFilter, searchQuery]);

  return (
    <DashboardLayout
      title="Verifikasi Akun Fresh Graduate"
      description="Kelola dan verifikasi pengajuan akun baru"
    >
      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 mb-4">
        <StatCard
          variant="blue"
          title="Total Pengajuan"
          value={stats.total}
          description="Semua akun yang masuk"
        />
        <StatCard
          variant="yellow"
          title="Menunggu"
          value={stats.pending}
          description="Belum diverifikasi"
        />
        <StatCard
          variant="green"
          title="Diverifikasi"
          value={stats.approved}
          description="Akun telah disetujui"
        />
        <StatCard
          variant="red"
          title="Ditolak"
          value={stats.rejected}
          description="Akun tidak disetujui"
        />
      </div>

      <div className="my-8">
        <h1 className="text-xl font-semibold">Daftar Pengajuan Akun</h1>
        <p className="text-sm text-gray-500">Klik baris untuk melihat detail.</p>
      </div>

      <div className="flex flex-col md:flex-row lg:items-center lg:justify-between gap-4 mb-7">
        {/* Search */}
        <div className="relative w-full md:max-w-xl lg:max-w-md">
          <SearchInput
            placeholder="Cari nama, no hp, atau pendidikan...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 flex-wrap">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? "primary" : "soft"}
              className="rounded-full font-semibold border border-info-200"
              size="sm"
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-x-scroll md:overflow-x-hidden overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-100 text-sm overflow-hidden">
            <tr>
              <th className="table-head">No</th>
              <th className="table-head">Nama Lengkap</th>
              <th className="table-head">No Hp</th>
              <th className="table-head">Pendidikan Terakhir</th>
              <th className="table-head">Status</th>
              <th className="table-head">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredProfiles.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  {searchQuery
                    ? `Tidak ada hasil untuk "${searchQuery}"`
                    : "Tidak ada data pengajuan."}
                </td>
              </tr>
            ) : (
              filteredProfiles.map((profile, idx) => (
                <tr
                  key={`${profile.email}-${idx}`}
                  className="bg-white border-b border-gray-100"
                >
                  <td className="table-data">{idx + 1}</td>
                  <td className="table-data font-bold text-gray-900">
                    {profile.fullName}
                  </td>
                  <td className="table-data text-gray-600">{profile.phone}</td>
                  <td className="table-data text-gray-600">
                    {profile.lastEducation}
                  </td>
                  <td className="table-data">
                    <Badge
                      size="sm"
                      variant={STATUS_BADGE_VARIANT[profile.status]}
                      className="border-none text-black"
                    >
                      {STATUS_LABEL[profile.status]}
                    </Badge>
                  </td>
                  <td className="table-data">
                    <Link
                      to={`/admin/verifikasi-freshgraduate/${profile.fullName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-center block border p-0.5 border-primary rounded-md text-blue-600 cursor-pointer hover:bg-primary/25"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}