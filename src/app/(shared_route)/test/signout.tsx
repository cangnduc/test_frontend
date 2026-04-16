"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };
  return (
    <button
      onClick={handleSignOut}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
    >
      Sign Out
    </button>
  );
}
