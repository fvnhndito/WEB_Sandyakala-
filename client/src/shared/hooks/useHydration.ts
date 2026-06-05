import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAppDispatch } from "../stores/hook";
import { axiosInstance } from "../lib/axios";
import { authLogin } from "@/features/auth/authSlice";

export const useHydration = () => {
  const dispatch = useAppDispatch();
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const hydrateAuth = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) return;

      const response = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = response.data;

      if (result.success && result.data) {
        const user = result.data;
        console.log("Hydrated user:", user);

        dispatch(
          authLogin({
            id: user.id,
            email: user.email,
            role: user.role,
          }),
        );

        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.log("Failed to hydrate auth:", error);

      if (isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    } finally {
      setIsHydrated(true);
    }
  }, [dispatch]);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return {
    isHydrated,
  };
};
