import { Link, Navigate } from "react-router-dom";
import ImageAuth from "@/assets/images/Image Auth.png";
import { useAppSelector } from "../stores/hook";

interface AuthLayoutProps {
  children: React.ReactNode;
  type: "login" | "register";
}

export default function AuthLayout({ children, type }: AuthLayoutProps) {
  const authSelector = useAppSelector((state) => state.auth);

  if (authSelector.id) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl p-6">
        <div className="flex bg-white">
          <div className="w-full md:w-1/2 flex items-center justify-center p-10">
            <div className="w-full max-w-sm">
              <h1 className="text-xl font-semibold text-center mb-10">
                {type === "register" ? "Registrasi" : "Masuk"}
              </h1>

              {children}

              <p className="text-xs text-center mt-4">
                {type === "register"
                  ? "Sudah punya akun? "
                  : "Belum punya akun? "}

                <Link
                  to={type === "register" ? "/auth/login" : "/auth/register"}
                  className="text-blue-600 cursor-pointer"
                >
                  {type === "register" ? "Masuk" : "Daftar"}
                </Link>
              </p>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2">
            <img
              src={ImageAuth}
              alt="Auth"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
