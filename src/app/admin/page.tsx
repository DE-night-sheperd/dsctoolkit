import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/app/actions";
import AdminPasswordGate from "@/app/admin/admin-password-gate";

export default async function AdminPage() {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (isAuthenticated) {
      redirect("/admin/dashboard");
    }
    return <AdminPasswordGate />;
  } catch (error) {
    console.error("Error in AdminPage:", error);
    return <AdminPasswordGate />;
  }
}
