import { SearchInput } from "@/shared/components/ui/search-input";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import type { StatCardDataType } from "@/features/umkm/types/dashboard.types";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "@/assets/images/logo.png";
import { IoClose } from "react-icons/io5";
import { cn } from "../lib/utils";

interface DataTaskLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onSearch?: (query: string) => void;
  tabs?: {
    label: string;
    path: string;
    key: string;
  }[];
  activeTab?: string;
  statusOptions?: string[];
  statCardData?: StatCardDataType[];
  statCardSlot?: React.ReactNode;
  onStatusChange?: (status: string) => void;
}

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
          "font-medium transition-all text-xs duration-300",
          isMobile ? "block" : "pb-2 border-b-3",
          isActive
            ? "text-mint border-mint"
            : "text-slate-500 border-transparent hover:text-mint",
        )
      }
    >
      {children}
    </NavLink>
  );
};

export default function DataTaskLayout({
  children,
  title,
  description,
  onSearch,
  tabs = [],
  activeTab,
  statusOptions = [],
  statCardSlot,
  onStatusChange,
}: DataTaskLayoutProps) {
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="bg-neutral-400 min-h-screen p-4 sm:p-10 lg:p-25 flex justify-center">
      <nav className="fixed top-0 left-0 w-full z-40 shadow-md bg-white transition-all">
        <div className="max-w-6xl mx-auto px-8 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/umkm/home">
              <img src={logo} alt="FreshStart" className="h-10 w-auto object-contain" />
            </Link>
          </div>
          <ul className="hidden md:flex gap-10 items-center">
            {navItems.map((item) => (
              <li key={item.title}>
                <NavItem to={item.to}>{item.title}</NavItem>
              </li>
            ))}

            <div className="h-10 w-10 bg-gray-100 rounded-full shadow ms-2 border border-slate-300 overflow-hidden cursor-pointer">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </ul>

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

      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

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
                src="https://i.pravatar.cc/150?img=11"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-mint-300 text-sm">UMKM Partner</h2>
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

      <div className="bg-white w-full max-w-5xl px-4 sm:px-8 lg:px-12 py-6 rounded-lg shadow-md">
        {/* HEADER */}
        <div className="flex flex-row p-3 sm:p-5 items-center">
          <GoArrowLeft
            className="text-3xl mr-5 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <h3 className="font-extrabold text-h5">{title}</h3>
            <p className="text-neutral-600 mt-1.5">{description}</p>
          </div>
        </div>

        {/* STAT CARD */}
        {statCardSlot && <div className="px-6 mt-4">{statCardSlot}</div>}

        {/* TABS (optional) */}
        {tabs.length > 0 && (
          <div className="w-full px-2 sm:px-8 mt-6 mb-3 overflow-x-auto">
            <div className="flex gap-4 sm:gap-10 border-b border-neutral-300 text-sm sm:text-lg font-bold text-primary-dark min-w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => navigate(tab.path)}
                  className={`pb-2 px-5 transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? "border-b-4 border-mint"
                      : "border-b-4 border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH & FILTER */}
        <div className="flex gap-3 p-6">
          <SearchInput
            placeholder="Cari nama atau posisi pekerja..."
            onChange={(e) => onSearch?.(e.target.value)} // ← tambah ini
          />

          {statusOptions.length > 0 && (
            <select
              value={selectedStatus}
              className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-mint-100/15"
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                onStatusChange?.(e.target.value);
              }}
            >
              <option value="">Semua Status</option>

              {statusOptions.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* CONTENT */}
        {children}
      </div>
    </div>
  );
}