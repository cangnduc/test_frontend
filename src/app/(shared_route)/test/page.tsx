import { headers } from "next/headers";
import SignOut from "./signout";
import { authServer } from "@/lib/auth/auth-server";

export default async function Test() {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>Welcome, {session?.user?.email}!</p>
      <SignOut />
    </div>
  );
}
