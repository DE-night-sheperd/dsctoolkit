import { redirect } from "next/navigation";
import { checkAuth } from "./actions";
import PasswordGate from "./password-gate";

export default async function Home() {
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    redirect("/dashboard");
  }
  return <PasswordGate />;
}
