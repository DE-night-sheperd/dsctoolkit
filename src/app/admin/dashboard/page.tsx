import { redirect } from "next/navigation";
import { checkAdminAuth, getDocuments } from "@/app/actions";
import AdminDashboardClient from "./admin-dashboard-client";

export default async function AdminDashboard() {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      redirect("/admin");
    }
    const documents = await getDocuments();
    return <AdminDashboardClient initialDocuments={documents} />;
  } catch (error) {
    console.error("Error in AdminDashboard:", error);
    // Fallback to empty documents array
    return <AdminDashboardClient initialDocuments={[]} />;
  }
}
