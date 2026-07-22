import { redirect } from "next/navigation";
import { checkAuth, getApprovedDocuments } from "../actions";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      redirect("/");
    }
    const documents = await getApprovedDocuments();
    return <DashboardClient initialDocuments={documents} />;
  } catch (error) {
    console.error("Error in Dashboard:", error);
    return <DashboardClient initialDocuments={[]} />;
  }
}
