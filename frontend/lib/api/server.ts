import { getApiBaseUrl } from "@/lib/api-base";

const DEFAULT_REVALIDATE = Number(
  process.env.SEO_REVALIDATE_SECONDS ?? "300"
);

type ServerFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export async function serverApiGet<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T | null> {
  const { revalidate = DEFAULT_REVALIDATE, tags } = options;
  const base = getApiBaseUrl();

  try {
    const response = await fetch(`${base}${endpoint}`, {
      headers: { Accept: "application/json" },
      next:
        revalidate === false
          ? { revalidate: 0 }
          : { revalidate, ...(tags?.length ? { tags } : {}) },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
