const BASE_URL = "http://localhost:3000/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const mergedHeaders = {
      ...headers,
      ...(options.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: mergedHeaders,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Terjadi kesalahan pada server",
        errors: result.errors || [],
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Tidak dapat terhubung ke server. Pastikan server aktif.",
    };
  }
}

export const api = {
  get: <T>(path: string) =>
    apiRequest<T>(path, { method: "GET" }),
 
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
 
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

    patch: <T>(path: string, body?: unknown) =>
  apiRequest<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  }),
 
  delete: <T>(path: string) =>
    apiRequest<T>(path, { method: "DELETE" }),
};