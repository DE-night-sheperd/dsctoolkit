import { redirect } from "next/navigation";
import { checkAuth } from "./actions";
import PasswordGate from "./password-gate";

export default async function Home() {
  try {
    const isAuthenticated = await checkAuth();
    if (isAuthenticated) {
      redirect("/dashboard");
    }
    return <PasswordGate />;
  } catch (error) {
    console.error("Error in Home page:", error);
    return <PasswordGate />;
  }
}
