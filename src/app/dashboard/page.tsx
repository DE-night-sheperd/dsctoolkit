import { redirect } from "next/navigation";
import { checkAuth, getApprovedDocuments } from "../actions";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    redirect("/");
  }
  const documents = await getApprovedDocuments();
  return <DashboardClient initialDocuments={documents} />;
}
