import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import AuthLayout from "@/shared/layouts/AuthLayout";
import { loginSchema, type LoginInput } from "../auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/shared/lib/axios";
import { useAppDispatch } from "@/shared/stores/hook";
import { authLogin } from "../authSlice";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    console.log("Login data:", data);
    setLoading(true);
    setServerError(null);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        const { accessToken, user } = response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(
          authLogin({
            id: user.id,
            email: user.email,
            role: user.role,
          }),
        );
      }
    } catch (err) {
      console.log("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="login">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs mb-4">
          {serverError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="example@gmail.com"
          disabled={loading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">
            {errors.email.message}
          </p>
        )}

        <Input
          type="password"
          placeholder="********"
          disabled={loading}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">
            {errors.password.message}
          </p>
        )}

        <Button
          className="w-full"
          variant={"primary-dark"}
          size={"lg"}
          type="submit"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </AuthLayout>
  );
}
