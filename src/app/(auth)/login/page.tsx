import ClientLoginPage from "./client-login";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/getSession";
export default async function LoginPage() {
  const session = await getSession();

  //wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (!session) {
    return <ClientLoginPage />;
  } else {
    redirect("/");
  }
}
