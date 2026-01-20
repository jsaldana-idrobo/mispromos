export type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

const readApiBase = () => {
  const base = document.body.dataset.apiBase;
  return base && base.length > 0 ? base : "http://localhost:3000/api/v1";
};

export const API_BASE = readApiBase();

const parseErrorMessage = (payload: ApiError | undefined) => {
  if (!payload?.message) {
    return "Ocurrió un error inesperado";
  }
  if (Array.isArray(payload.message)) {
    return payload.message.join(", ");
  }
  return payload.message;
};

export const apiFetch = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const globalAny = globalThis as typeof globalThis & {
    __netLoadingCount?: number;
    __setNetLoading?: (value: boolean) => void;
  };
  if (!globalAny.__setNetLoading) {
    globalAny.__netLoadingCount = 0;
    globalAny.__setNetLoading = (value: boolean) => {
      const next = (globalAny.__netLoadingCount ?? 0) + (value ? 1 : -1);
      globalAny.__netLoadingCount = Math.max(0, next);
      if (globalAny.__netLoadingCount > 0) {
        document.documentElement.dataset.netLoading = "true";
      } else {
        delete document.documentElement.dataset.netLoading;
      }
    };
  }
  globalAny.__setNetLoading?.(true);
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  }).finally(() => {
    globalAny.__setNetLoading?.(false);
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? ((await response.json()) as T | ApiError)
    : undefined;

  if (!response.ok) {
    const message = parseErrorMessage(payload as ApiError | undefined);
    throw new Error(message);
  }

  if (!isJson) {
    return undefined as T;
  }

  return payload as T;
};
