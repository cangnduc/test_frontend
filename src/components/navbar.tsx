import Link from "next/link";
import { Search } from "lucide-react";
import { getSession } from "@/actions/getSession";
import { NavbarContainer } from "./navbar/navbar-container";
import { UserNav } from "./navbar/user-nav";
import { MobileMenu } from "./navbar/mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import type { Session } from "@/auth/auth";
import { Suspense } from "react";
const navLinks = [
  { href: "/courses", label: "Courses", iconName: "Book" },
  { href: "/practice", label: "Practice", iconName: "Activity" },
  { href: "/tests", label: "Tests", iconName: "SquareCheck" },
  { href: "/dashboard", label: "Dashboard", iconName: "LayoutDashboard" },
];

export function Navbar() {
  return (
    <NavbarContainer>
      {/* Logo - Server Side */}
      <Link
        href="/"
        className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
      >
        <div className="h-5 w-5 rounded bg-primary" />
        <span className="text-[12px] font-semibold uppercase tracking-widest hidden sm:block">
          Antigravity
        </span>
      </Link>

      {/* Desktop Links - Server Side */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Actions - Mixture of Server-rendered containers and Client-side leaves */}
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Search className="h-4 w-4" />
        </button>

        <ThemeToggle />

        {/* Dynamic actions wrapped in Suspense to isolate dynamic getSession() call */}
        <Suspense fallback={<NavbarActionsFallback />}>
          <NavbarActions />
        </Suspense>
      </div>
    </NavbarContainer>
  );
}

async function NavbarActions() {
  const sessionData: Session | null = await getSession();
  
  return (
    <>
      {/* Client side Profile/Sign-in Leaf */}
      <UserNav initialSession={sessionData} />

      {/* Client side Mobile Menu Leaf */}
      <MobileMenu initialSession={sessionData} links={navLinks} />
    </>
  );
}

function NavbarActionsFallback() {
  return (
    <div className="flex items-center gap-4">
      {/* UserNav Placeholder */}
      <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
      {/* MobileMenu Placeholder */}
      <div className="h-5 w-5 rounded bg-muted animate-pulse md:hidden" />
    </div>
  );
}

