import ClientLoginPage from "./client-login";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/getSession";
export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <ClientLoginPage />;
}
