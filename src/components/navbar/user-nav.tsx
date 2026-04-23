"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { authClient } from "@/auth/auth-client";
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

  return (
    <Link href="/profile" className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
        <UserCircle className="h-4 w-4 text-primary" />
      </div>
    </Link>
  );
}
