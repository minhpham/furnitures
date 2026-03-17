import type { Category } from "@/hooks/use-categories";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type { Category };

function normalizeList(data: Category[] | { items: Category[] }): Category[] {
  return Array.isArray(data) ? data : (data.items ?? []);
}

/**
 * Server-side fetch for all active categories.
 */
export async function getCategories(): Promise<Category[]> {
  const url = `${BASE_URL}/api/v1/categories`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message: string =
      (body as { message?: string } | null)?.message ??
      (await res.text().catch(() => res.statusText));
    throw new Error(message);
  }

  const data = await res.json();
  return normalizeList(data);
}

/**
 * Server-side fetch for a single category by ID (includes products).
 */
export async function getCategoryById(id: string): Promise<Category> {
  const url = `${BASE_URL}/api/v1/categories/${id}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message: string =
      (body as { message?: string } | null)?.message ??
      (await res.text().catch(() => res.statusText));
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<Category>;
}
