import type { Metadata } from "next";
import { CategoryForm } from "@/app/components/dashboard/CategoryForm";

export const metadata: Metadata = {
  title: "Add Category — Milan Dashboard",
};

export default function NewCategoryPage() {
  return <CategoryForm />;
}
