"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductTable } from "@/app/components/dashboard/ProductTable";

function SkeletonRow() {
  return (
    <tr className="border-b border-[#F5F5F5]">
      {[10, 30, 12, 10, 10, 8].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className={`h-4 bg-[#F0F0F0] rounded-sm animate-pulse w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

export function ProductsClient() {
  const { data: products, isPending, isError, error } = useProducts();

  if (isPending) {
    return (
      <table className="w-full">
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <p className="text-sm text-[#888888]" style={{ fontFamily: "Inter" }}>
          {error instanceof Error ? error.message : "Failed to load products"}
        </p>
      </div>
    );
  }

  return <ProductTable products={products ?? []} />;
}
