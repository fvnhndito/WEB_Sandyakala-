import React, { useState } from "react";
import { BiNotepad, BiSolidGridAlt, BiSolidUser, BiMenu } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Navigate, NavLink, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";
import LogoFreshstart from "@/assets/images/Logo FreshStart.png";
import Dropdown from "../components/dropdown";
import { useAppSelector } from "../stores/hook";

const menus = [
  { name: "Dashboard", icon: BiSolidGridAlt, to: "/admin/dashboard" },

  {
    name: "Verifikasi",
    icon: BiSolidUser,
    subItems: [
      { name: "Akun UMKM", to: "/admin/verifikasi-umkm/" },
      {
        name: "Akun Lulusan Baru",
        to: "/admin/verifikasi-freshgraduate/",
      },
    ],
  },

  { name: "Laporan", icon: BiNotepad, to: "/admin/laporan" },
];

interface MenuItemProps {
  name: string;
  icon: React.ElementType;
  to: string;
  onClick?: () => void;
}

const MenuItem = ({ name, icon: Icon, to, onClick }: MenuItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex gap-3 items-center px-4 py-2 rounded-lg cursor-pointer text-white transition-colors ${
          isActive ? "bg-info-300" : "hover:bg-info-300/50"
        }`
      }
    >
      <Icon className="h-6 w-6 shrink-0" />
      <span className="truncate">{name}</span>
    </NavLink>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
}

export default function DashboardLayout({
  children,
  title,
  description,
  showBackButton = false,
}: DashboardLayoutProps) {
  const authSelector = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (authSelector.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex bg-info-100/15 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-secondary text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="px-6 py-4 flex gap-3 justify-center items-center border-b border-white">
            <img
              src={LogoFreshstart}
              alt="Logo FreshStart"
              className="h-10 w-10 shrink-0"
            />
            <h1 className="font-semibold text-lg truncate">FreshStart</h1>
          </div>

          <nav className="p-4 space-y-2.5 overflow-y-auto">
            {menus.map((menu) => {
              if (menu.subItems) {
                return (
                  <Dropdown
                    key={menu.name}
                    title={menu.name}
                    icon={menu.icon}
                    subItems={menu.subItems}
                  />
                );
              }

              return (
                <MenuItem
                  key={menu.name}
                  name={menu.name}
                  icon={menu.icon}
                  to={menu.to}
                  onClick={() => setIsSidebarOpen(false)}
                />
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white flex justify-center items-center">
          <div className="flex gap-4 items-center">
            <div className="h-9 w-9 bg-white rounded-full shrink-0"></div>
            <p className="text-sm truncate">Admin Utama</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white px-4 lg:px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant={"primary-dark"}
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 rounded-md lg:hidden inline"
            >
              <BiMenu className="h-7 w-7" />
            </Button>
            <p className="text-sm hidden sm:block">
              Selamat datang, <span className="font-bold">ADMIN</span>
            </p>
          </div>

          <div className="bg-secondary flex items-center gap-2 text-white px-3 py-1.5 lg:py-1 rounded-full font-base text-xs lg:text-sm cursor-pointer hover:bg-secondary/90 transition-colors">
            <span>Admin</span>
            <MdKeyboardArrowDown className="h-5 w-5 lg:h-6 lg:w-6" />
          </div>
        </header>

        <div className="p-4 lg:p-6 flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {showBackButton && (
              <Button
                onClick={() => navigate(-1)}
                variant={"ghost"}
                className="text-4xl lg:text-5xl p-0 h-auto self-start sm:self-center hover:bg-transparent"
              >
                <IoIosArrowRoundBack />
              </Button>
            )}
            <div>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
                {title}
              </h1>
              {description && (
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/50 rounded-xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
