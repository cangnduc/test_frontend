import { getSession } from "@/actions/getSession";
export default async function Test() {
  const session = await getSession();

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>Welcome, {session?.user?.email}!</p>
    </div>
  );
}
