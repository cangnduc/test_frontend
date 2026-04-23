import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { Suspense } from "react";
import type { Session } from "@/auth/auth";

export function UserNav({
  initialSession,
}: {
  initialSession: Session | null;
}) {
  if (!initialSession) {
    return (
      <Link
        href="/login"
        className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        Sign In
      </Link>
    );
  }
  console.log("where is this running?");
  return (
    <Link href="/profile" className="flex items-center gap-2">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
          {initialSession.user.image ? (
            <Image
              src={initialSession.user.image}
              alt={initialSession.user.name}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <UserCircle className="h-4 w-4 text-primary" />
          )}
        </div>
      </Suspense>
    </Link>
  );
}
