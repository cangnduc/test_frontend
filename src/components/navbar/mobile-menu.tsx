"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Book,
  Activity,
  SquareCheck,
  LayoutDashboard,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/auth/auth-client";
import type { Session } from "@/auth/auth";

const iconMap = {
  Book,
  Activity,
  SquareCheck,
  LayoutDashboard,
};

interface MobileMenuProps {
  initialSession: Session | null;
  links: { href: string; label: string; iconName: string }[];
}

export function MobileMenu({ initialSession, links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className="relative z-[70] md:hidden text-muted-foreground hover:text-foreground transition-all active:scale-95 px-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <div className="relative h-5 w-5">
           <X 
             className={cn(
               "absolute inset-0 h-5 w-5 transition-all duration-300",
               isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
             )} 
           />
           <Menu 
             className={cn(
               "absolute inset-0 h-5 w-5 transition-all duration-300",
               isOpen ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
             )} 
           />
        </div>
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background/98 pt-[48px] backdrop-blur-[20px] transition-all duration-500 md:hidden",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-[-10px] opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-6 px-10 py-12">
          {links.map((link, idx) => {
            const Icon = iconMap[link.iconName as keyof typeof iconMap];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-4 text-[21px] font-semibold text-foreground transition-all duration-500 hover:text-primary",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0",
                )}
                style={{ transitionDelay: `${idx * 75}ms` }}
                onClick={closeMenu}
              >
                <Icon className="h-6 w-6 text-muted-foreground" />
                {link.label}
              </Link>
            );
          })}

          <div
            className={cn(
              "mt-4 h-px w-full bg-border transition-all duration-1000",
              isOpen ? "scale-x-100" : "scale-x-0",
            )}
            style={{ transitionDelay: "400ms" }}
          />

          <div
            className={cn(
              "mt-4 flex flex-col gap-4 transition-all duration-500",
              isOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0",
            )}
            style={{ transitionDelay: "450ms" }}
          >
            {initialSession ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-foreground">
                      {initialSession.user.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      Signed in
                    </span>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await authClient.signOut();
                    closeMenu();
                  }}
                  className="flex items-center gap-4 text-[21px] font-semibold text-destructive hover:opacity-70 transition-opacity"
                >
                  <LogOut className="h-6 w-6" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-foreground">
                      Guest Mode
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      Limited access
                    </span>
                  </div>
                </div>
                <Link
                  href="/login"
                  className="flex items-center gap-4 text-[21px] font-semibold text-primary hover:opacity-70 transition-opacity"
                  onClick={closeMenu}
                >
                  <UserCircle className="h-6 w-6" />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
