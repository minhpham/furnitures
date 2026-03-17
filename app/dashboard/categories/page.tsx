import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/lib/api/categories";
import {
  CategoryListClient,
  CategoryListSkeleton,
} from "@/app/components/dashboard/CategoryListClient";

export const metadata: Metadata = {
  title: "Categories — Milan Dashboard",
};

async function CategoryListLoader() {
  let data: Category[];
  try {
    data = await getCategories();
  } catch {
    data = [];
  }

  return <CategoryListClient initialData={data} />;
}

export default function CategoriesPage() {
  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListLoader />
      </Suspense>
    </div>
  );
}
