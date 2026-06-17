import { cn } from "@/shared/lib/utils";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import logo from "@/assets/images/logo.png";
import { ModalNotification } from "@/shared/components/ui/modal-notification";
import { useAppDispatch, useAppSelector } from "../stores/hook";
import { authLogout } from "@/features/auth/authSlice";
import { apiRequest } from "../lib/api";

const navItems = [
  { title: "Home", to: "/umkm/home" },
  { title: "Dashboard", to: "/umkm/dashboard" },
  { title: "Lowongan", to: "/umkm/lowongan" },
  { title: "Profile", to: "/umkm/profile" },
];

const NavItem = ({
  to,
  children,
  onClick,
  isMobile = false,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "font-bold transition-colors duration-200 relative",
          isMobile ? "block text-sm py-2" : "text-sm pb-1",
          isActive
            ? isMobile
              ? "text-teal-400"
              : "text-teal-400 underline decoration-4 underline-offset-8"
            : "text-primary-dark hover:text-teal-400",
        )
      }
    >
      {children}
    </NavLink>
  );
};

const profileMenuItems = [
  { label: "Keamanan Akun", path: "modal" },
  { label: "Chat", path: "/chat" },
  { label: "Keluar", path: "keluar" },
];

function UbahAkunModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!username && !password) {
      setError("Isi minimal username atau password baru.");
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (password && password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    // ubah username atau password
    const res = await apiRequest("/auth/update-account", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        username: username || undefined,
        password: password || undefined,
      }),
    });

    if (res.success) setShowSuccessModal(true);
    else setError(res.message || "Gagal memperbarui akun");
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Keamanan Akun</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username Baru
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username baru"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Konfirmasi Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition
                 "
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-teal-400 hover:bg-teal-500 text-white rounded-lg py-2 text-sm font-medium transition cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      {/* Modal Notifikasi Sukses setelah Simpan */}
      <ModalNotification
        visible={showSuccessModal}
        title="Akun berhasil diperbarui!"
        subtitle="Perubahan username dan password kamu telah disimpan."
        button={{
          type: "single",
          label: "Kembali",
          onPress: handleSuccessClose,
        }}
      />
    </>
  );
}

//  Profile Menu 
function ProfileMenu() {
  const dispatch = useAppDispatch();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAkunModalOpen, setIsAkunModalOpen] = React.useState(false);
  const [isKeluarModalOpen, setIsKeluarModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || "";
  const profileKey = userEmail
    ? `registered_umkm_profile_${userEmail}`
    : "registered_umkm_profile";
  const savedProfileStr = localStorage.getItem(profileKey);
  const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
  const logoUsaha =
    savedProfile?.businessLogo || "https://i.pravatar.cc/150?img=11";

  const handleClick = (path: string) => {
    setIsMenuOpen(false);
    if (path === "modal") {
      setIsAkunModalOpen(true);
    } else if (path === "keluar") {
      setIsKeluarModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleKeluar = () => {
    setIsKeluarModalOpen(false);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    dispatch(authLogout());
    navigate("/auth/login");
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 focus:outline-none cursor-pointer"
        >
          <img
            src={logoUsaha}
            alt="profile"
            className="h-8 w-8 rounded-full border border-gray-900 object-cover"
          />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 z-20 py-1">
              {profileMenuItems.map(({ label, path }, key) => {
                const isLastItem = key === profileMenuItems.length - 1;
                return (
                  <button
                    key={label}
                    onClick={() => handleClick(path)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                      isLastItem
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal Keamanan Akun */}
      {isAkunModalOpen && (
        <UbahAkunModal onClose={() => setIsAkunModalOpen(false)} />
      )}

      {/* Modal Konfirmasi Keluar */}
      <ModalNotification
        visible={isKeluarModalOpen}
        title="Yakin ingin keluar dari akun?"
        subtitle="Sesi kamu akan diakhiri dan kamu perlu login kembali untuk melanjutkan."
        button={{
          type: "double",
          cancelLabel: "Tidak",
          confirmLabel: "Ya, Keluar",
          onCancel: () => setIsKeluarModalOpen(false),
          onConfirm: handleKeluar,
        }}
      />
    </>
  );
}

export default function DashboardUmkmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authSelector = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  if (authSelector.role !== "UMKM") {
    return <Navigate to="/" />;
  }

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || "";
  const profileKey = userEmail
    ? `registered_umkm_profile_${userEmail}`
    : "registered_umkm_profile";
  const savedProfileStr = localStorage.getItem(profileKey);
  const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
  const logoUsaha =
    savedProfile?.businessLogo || "https://i.pravatar.cc/150?img=11";

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 w-full z-40 shadow-md bg-white transition-all">
        <div className="max-w-6xl mx-auto px-8 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/umkm/home">
              <img
                src={logo}
                alt="FreshStart"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          <ul className="hidden md:flex gap-10 items-center">
            {navItems.map((item) => (
              <li key={item.title}>
                <NavItem to={item.to}>{item.title}</NavItem>
              </li>
            ))}
            <li>
              <ProfileMenu />
            </li>
          </ul>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden cursor-pointer p-2 text-primary-dark focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ── MOBILE SIDEBAR ── */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex justify-end p-4 border-b border-gray-100">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 cursor-pointer text-gray-500 hover:text-red-500 bg-gray-50 rounded-full transition-colors"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="h-12 w-12 bg-gray-100 rounded-full overflow-hidden border border-slate-300">
              <img
                src={logoUsaha}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-mint-300 text-sm">
                {savedProfile?.businessName || "UMKM Partner"}
              </h2>
              <p className="text-xs text-gray-500">Lihat Profil</p>
            </div>
          </div>

          <ul className="flex flex-col gap-6">
            {navItems.map((item) => (
              <li key={item.title}>
                <NavItem
                  to={item.to}
                  isMobile
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </NavItem>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {children}
    </>
  );
}
