"use client";

import { useProduct } from "@/hooks/use-products";
import { ProductForm } from "@/app/components/dashboard/ProductForm";

export function EditProductClient({ id }: { id: string }) {
  const { data: product, isPending, isError } = useProduct(id);

  if (isPending) {
    return (
      <div className="flex flex-col flex-1">
        {/* Skeleton header */}
        <div className="flex items-center gap-4 px-8 py-5 bg-white border-b border-[#EEEEEE]">
          <div className="w-8 h-8 bg-[#F0F0F0] animate-pulse rounded-sm" />
          <div className="flex flex-col gap-2">
            <div className="w-36 h-5 bg-[#F0F0F0] animate-pulse rounded-sm" />
            <div className="w-24 h-3 bg-[#F0F0F0] animate-pulse rounded-sm" />
          </div>
        </div>
        {/* Skeleton body */}
        <div className="p-8 flex gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white border border-[#EEEEEE] p-6 space-y-4">
              <div className="h-4 w-32 bg-[#F0F0F0] animate-pulse rounded-sm" />
              <div className="h-10 bg-[#F0F0F0] animate-pulse rounded-sm" />
              <div className="h-24 bg-[#F0F0F0] animate-pulse rounded-sm" />
            </div>
          </div>
          <div className="w-72 space-y-6">
            <div className="bg-white border border-[#EEEEEE] p-6 h-32 animate-pulse" />
            <div className="bg-white border border-[#EEEEEE] p-6 h-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <p className="text-sm text-[#888888]" style={{ fontFamily: "Inter" }}>
          Product not found or failed to load.
        </p>
      </div>
    );
  }

  return <ProductForm product={product} />;
}
