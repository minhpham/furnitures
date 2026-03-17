const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Read the JS-accessible `token` cookie (set on login, non-HttpOnly). */
function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const isFormData = options?.body instanceof FormData;
  const hasBody = options?.body !== undefined && options?.body !== null;
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      // Only set Content-Type for JSON bodies; omit for FormData (browser adds boundary) and bodyless requests (GET/DELETE)
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
      // Attach Bearer token whenever available
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message ?? (await res.text().catch(() => res.statusText));
    throw new ApiError(res.status, message);
  }

  // Treat 204 or empty body as no-content response
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text.trim()) return undefined as T;

  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body), ...options }),

  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body), ...options }),

  patch: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body), ...options }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { method: "DELETE", ...options }),

  /** POST with multipart/form-data (file uploads) */
  upload: <T>(path: string, formData: FormData, options?: RequestInit) =>
    request<T>(path, { method: "POST", body: formData, ...options }),

  /** PATCH with multipart/form-data (file uploads on update) */
  uploadPatch: <T>(path: string, formData: FormData, options?: RequestInit) =>
    request<T>(path, { method: "PATCH", body: formData, ...options }),
};
