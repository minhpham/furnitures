"use client";

import { useCategory } from "@/hooks/use-categories";
import { CategoryForm } from "@/app/components/dashboard/CategoryForm";

interface Props {
  id: string;
}

export function EditCategoryClient({ id }: Props) {
  const { data: category, isLoading, isError } = useCategory(id);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1">
        {/* Top bar skeleton */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-[#EEEEEE]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F0F0F0] rounded-sm animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-6 w-36 bg-[#F0F0F0] rounded-sm animate-pulse" />
              <div className="h-3 w-24 bg-[#F0F0F0] rounded-sm animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-[#F0F0F0] rounded-sm animate-pulse" />
            <div className="h-9 w-28 bg-[#F0F0F0] rounded-sm animate-pulse" />
          </div>
        </div>
        {/* Body skeleton */}
        <div className="flex-1 px-8 py-8 bg-[#F5F5F5]">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-[#EEEEEE] p-6">
              <div className="h-5 w-32 bg-[#F0F0F0] rounded-sm animate-pulse mb-5" />
              <div className="flex flex-col gap-5">
                <div className="h-10 w-full bg-[#F0F0F0] rounded-sm animate-pulse" />
                <div className="h-24 w-full bg-[#F0F0F0] rounded-sm animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <p className="text-sm text-[#888888]" style={{ fontFamily: "Inter" }}>
          Category not found.
        </p>
      </div>
    );
  }

  return <CategoryForm category={category} />;
}
