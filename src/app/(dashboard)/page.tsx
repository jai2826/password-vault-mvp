// app/page.tsx
import { DashboardClientPage } from "@/app/(dashboard)/client";
import { getCurrentUser } from "@/routes/queries";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  return <DashboardClientPage />;
}
