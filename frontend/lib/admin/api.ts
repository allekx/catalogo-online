import { clearAdminToken, getAdminToken } from "./auth";

/** Mesmo origin no browser; URL absoluta no SSR */
function getRequestOrigin(): string {
  if (typeof window !== "undefined") return "";
  const explicit = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");
  return (
    explicit ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, ...init } = options;
  const headers = new Headers(init.headers);

  if (auth) {
    const token = getAdminToken();
    if (token) headers.set("x-admin-key", token);
  }

  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${getRequestOrigin()}${path}`, { ...init, headers });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (res.status === 401) clearAdminToken();
    throw new ApiError(data.error ?? res.statusText, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const adminApi = {
  login: (password: string) =>
    request<{ token: string }>("/api/admin/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ password }),
    }),

  dashboard: () =>
    request<DashboardStats>("/api/admin/dashboard/stats"),

  products: {
    list: () => request<AdminProduct[]>("/api/admin/products"),
    get: (id: string) => request<AdminProduct>(`/api/admin/products/${id}`),
    create: (data: ProductPayload) =>
      request<AdminProduct>("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ProductPayload>) =>
      request<AdminProduct>(`/api/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/admin/products/${id}`, {
        method: "DELETE",
      }),
  },

  categories: {
    list: () => request<AdminCategory[]>("/api/admin/categories"),
    create: (data: CategoryPayload) =>
      request<AdminCategory>("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<CategoryPayload>) =>
      request<AdminCategory>(`/api/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/admin/categories/${id}`, {
        method: "DELETE",
      }),
  },

  orders: {
    list: (status?: string) =>
      request<AdminOrder[]>(
        status
          ? `/api/admin/orders?status=${encodeURIComponent(status)}`
          : "/api/admin/orders"
      ),
    get: (id: string) => request<AdminOrder>(`/api/admin/orders/${id}`),
    updateStatus: (id: string, status: OrderStatus) =>
      request<AdminOrder>(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  customers: {
    list: () => request<AdminCustomer[]>("/api/admin/customers"),
    get: (id: string) => request<AdminCustomerDetail>(`/api/admin/customers/${id}`),
  },

  uploadMultiple: (files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    return request<{ success: boolean; data: UploadResult[] }>(
      "/api/admin/upload/multiple",
      { method: "POST", body: form }
    );
  },
};

export type OrderStatus =
  | "PENDING"
  | "WHATSAPP_SENT"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface DashboardStats {
  productsCount: number;
  ordersCount: number;
  whatsappClicksTotal: number;
  topViewed: {
    id: string;
    name: string;
    slug: string;
    viewCount: number;
    whatsappClicks: number;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    customerName: string;
    createdAt: string;
  }[];
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  cloudinaryPublicId: string | null;
  images: string[];
  featured: boolean;
  isNew: boolean;
  productType: string | null;
  active: boolean;
  stock: number;
  salesCount: number;
  viewCount: number;
  whatsappClicks: number;
  categoryId: string;
  category?: { id: string; slug: string; name: string };
}

export interface ProductPayload {
  name: string;
  slug?: string;
  description: string;
  price: number;
  imageUrl: string;
  images?: string[];
  cloudinaryPublicId?: string | null;
  featured?: boolean;
  isNew?: boolean;
  productType?: string | null;
  active?: boolean;
  stock?: number;
  categoryId: string;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  notes: string | null;
  whatsappSent: boolean;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    city: string | null;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    observations: string | null;
  }[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  ordersCount: number;
  lastOrderAt: string | null;
  lastOrderTotal: number | null;
}

export interface AdminCustomerDetail extends AdminCustomer {
  notes: string | null;
  orders: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    itemsCount: number;
  }[];
}

export interface UploadResult {
  url: string;
  secureUrl?: string;
  publicId: string;
  width?: number;
  height?: number;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  WHATSAPP_SENT: "WhatsApp enviado",
  CONFIRMED: "Confirmado",
  IN_PRODUCTION: "Em produção",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};
