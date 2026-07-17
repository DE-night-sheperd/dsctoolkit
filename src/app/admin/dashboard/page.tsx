import { redirect } from "next/navigation";
import { checkAdminAuth, getDocuments } from "@/app/actions";
import AdminDashboardClient from "./admin-dashboard-client";

export default async function AdminDashboard() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    redirect("/admin");
  }
  const documents = await getDocuments();
  return <AdminDashboardClient initialDocuments={documents} />;
}
