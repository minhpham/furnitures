import type { Metadata } from "next";
import { ProductForm } from "@/app/components/dashboard/ProductForm";

export const metadata: Metadata = {
  title: "Add Product — Milan Dashboard",
};

export default function NewProductPage() {
  return <ProductForm />;
}
