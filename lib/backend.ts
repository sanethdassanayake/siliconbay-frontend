export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/siliconbay/api";

export const BACKEND_PROXY_BASE = "/api/backend";

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("token") ?? "";
};

export const withAuthHeaders = (headers: HeadersInit = {}) => {
  const token = getStoredToken();

  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};

export const toJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return { message: text } as T;
  }
};

export const requestBackend = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${BACKEND_PROXY_BASE}${path}`, {
    cache: "no-store",
    ...init,
    headers: withAuthHeaders({
      ...(init.headers ?? {}),
    }),
  });

  const data = await toJson<T>(response);

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data && "message" in data
        ? String((data as { message?: string }).message ?? "Request failed")
        : "Request failed"
    );
  }

  return data;
};