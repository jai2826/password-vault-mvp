// app/page.tsx
import { DashboardClientPage } from "@/app/(dashboard)/client";
import { getCurrentUser } from "@/routes/queries";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardClientPage />;
}
