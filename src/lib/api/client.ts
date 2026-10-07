import { API_ENDPOINTS } from "@/constants/api";
import type { ApiSuccess } from "@/types/api";
import { normalizeResponseError } from "./error";
import { tokenStore } from "./token-store";

interface RequestOptions extends RequestInit {
  auth?: boolean;
  retryAuth?: boolean;
}
let refreshInFlight: Promise<string> | null = null;

async function readData<T>(response: Response): Promise<T> {
  if (!response.ok) throw await normalizeResponseError(response);
  if (response.status === 204) return undefined as T;
  const envelope = (await response.json()) as ApiSuccess<T>;
  return envelope.data;
}

export async function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const response = await fetch(API_ENDPOINTS.auth.refresh, { method: "POST" });
    const payload = await readData<{ accessToken: string }>(response);
    tokenStore.set(payload.accessToken);
    return payload.accessToken;
  })();
  try {
    return await refreshInFlight;
  } catch (error) {
    tokenStore.set(null);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("mediflow:auth-expired"));
    throw error;
  } finally {
    refreshInFlight = null;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, retryAuth = true, headers, ...init } = options;
  const token = tokenStore.get();
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  if (auth && response.status === 401 && retryAuth) {
    await refreshAccessToken();
    return apiRequest<T>(path, { ...options, retryAuth: false });
  }
  return readData<T>(response);
}
