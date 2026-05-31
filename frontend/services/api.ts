import { clientEnv } from "@/lib/env";
import type {
  ApiCategoryPayload,
  ApiProductPayload,
} from "@/lib/products/api-types";

const API_BASE_URL = clientEnv.apiUrl;

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...init } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    url += `?${new URLSearchParams(params).toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  products: {
    list: (params?: {
      categoria?: string;
      busca?: string;
      destaque?: string;
    }) =>
      apiClient<ApiProductPayload[]>("/products", {
        cache: "no-store",
        params: params
          ? Object.fromEntries(
              Object.entries(params).filter(([, v]) => v != null && v !== "")
            )
          : undefined,
      }),
    get: (slug: string) =>
      apiClient<ApiProductPayload>(`/products/${slug}`),
    related: (slug: string, limit = 4) =>
      apiClient<ApiProductPayload[]>(`/products/${slug}/related`, {
        params: { limit: String(limit) },
      }),
  },
  categories: {
    list: () =>
      apiClient<ApiCategoryPayload[]>("/categories", { cache: "no-store" }),
  },
  health: () => apiClient<HealthResponse>("/health"),
};

interface HealthResponse {
  status: string;
  database: string;
  cloudinary: string;
}
