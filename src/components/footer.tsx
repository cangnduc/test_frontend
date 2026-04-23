"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-background py-20 px-4 border-t border-border transition-colors duration-500">
      <div className="container mx-auto max-w-[980px]">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-[20px] font-bold tracking-tight">Antigravity</span>
          </div>
          <div className="flex gap-10 text-[14px] text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Explore</Link>
            <Link href="#" className="hover:text-foreground">Methods</Link>
            <Link href="#" className="hover:text-foreground">Support</Link>
            <Link href="#" className="hover:text-foreground">Business</Link>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-[12px] text-muted-foreground">
          <p>© 2026 Antigravity Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
