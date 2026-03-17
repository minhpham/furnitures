import type { Metadata } from "next";
import { EditCategoryClient } from "./EditCategoryClient";

export const metadata: Metadata = {
  title: "Edit Category — Milan Dashboard",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditCategoryClient id={id} />;
}
