import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import { ProductListClient, ProductListSkeleton } from "@/app/components/dashboard/ProductListClient";

export const metadata: Metadata = {
  title: "Products — Milan Dashboard",
};

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

async function ProductListLoader({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.limit ?? "10", 10) || 10),
  );
  const search = searchParams.search?.trim() ?? undefined;

  let data;
  try {
    data = await getProducts(page, limit, search);
  } catch {
    // Render the client shell with an empty result set so the UI stays intact
    data = {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  return <ProductListClient initialData={data} />;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListLoader searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
