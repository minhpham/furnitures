import type { Product, ProductListResponse } from "@/hooks/use-products";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type { Product, ProductListResponse };

/**
 * Server-side fetch for the paginated product list.
 * Called from the Server Component — no cookies/browser APIs needed here;
 * auth token forwarding can be added via the `headers` option when required.
 */
export async function getProducts(
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }

  const url = `${BASE_URL}/api/v1/products?${params.toString()}`;

  const res = await fetch(url, {
    // Opt out of Next.js full-route caching so searches are always fresh
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message: string =
      (body as { message?: string } | null)?.message ??
      (await res.text().catch(() => res.statusText));
    throw new Error(message);
  }

  return res.json() as Promise<ProductListResponse>;
}

/**
 * Server-side fetch for a single product by ID.
 * Throws ApiError (with status 404) when the product is not found.
 */
export async function getProductById(id: string): Promise<Product> {
  const url = `${BASE_URL}/api/v1/products/${id}`;

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

  return res.json() as Promise<Product>;
}

/**
 * Server-side delete (hard delete via DELETE, mirrors existing PATCH soft-delete
 * but exposes a true DELETE endpoint when available).
 * Used only in Server Actions; not called from this module directly.
 */
export async function deleteProductById(id: string): Promise<void> {
  const url = `${BASE_URL}/api/v1/products/${id}`;
  const res = await fetch(url, { method: "DELETE", cache: "no-store" });
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => null);
    const message: string =
      (body as { message?: string } | null)?.message ??
      (await res.text().catch(() => res.statusText));
    throw new Error(message);
  }
}
