import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function parseErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) =>
          typeof item === "object" && item && "msg" in item
            ? String((item as { msg: unknown }).msg)
            : String(item),
        )
        .join(", ");
    }
  }
  return `Request failed with status ${status}`;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return Promise.reject(
          new ApiError(
            parseErrorMessage(error.response.data, error.response.status),
            error.response.status,
          ),
        );
      }
    }
    return Promise.reject(
      new ApiError("Cannot reach server. Is the API running?", 0),
    );
  },
);

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let data: unknown = undefined;
  if (options.body) {
    if (typeof options.body === "string") {
      try {
        data = JSON.parse(options.body);
      } catch {
        data = options.body;
      }
    } else {
      data = options.body;
    }
  }

  let headers: Record<string, string> | undefined;
  if (options.headers) {
    if (options.headers instanceof Headers) {
      headers = {};
      options.headers.forEach((value, key) => {
        headers![key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      headers = Object.fromEntries(options.headers);
    } else {
      headers = options.headers as Record<string, string>;
    }
  }

  const response = await apiClient.request<T>({
    url: path,
    method: options.method || "GET",
    data,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  return response.data;
}

export function getApiBaseUrl(): string {
  return API_URL;
}
