import Link from "next/link";
import {
  Search,
  Book,
  Activity,
  SquareCheck,
  LayoutDashboard,
} from "lucide-react";
import { getSession } from "@/actions/getSession";
import { NavbarContainer } from "./navbar/navbar-container";
import { UserNav } from "./navbar/user-nav";
import { MobileMenu } from "./navbar/mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import type { Session } from "@/auth/auth";

const navLinks = [
  { href: "/courses", label: "Courses", iconName: "Book" },
  { href: "/practice", label: "Practice", iconName: "Activity" },
  { href: "/tests", label: "Tests", iconName: "SquareCheck" },
  { href: "/dashboard", label: "Dashboard", iconName: "LayoutDashboard" },
];

export async function Navbar() {
  const sessionData = await getSession();

  // Create a plain object for serialization
  const serializedSession = sessionData
    ? {
        user: { ...sessionData.user },
        session: { ...sessionData.session },
      }
    : null;

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

        {/* Client side Profile/Sign-in Leaf */}
        <UserNav initialSession={sessionData} />

        {/* Client side Mobile Menu Leaf */}
        <MobileMenu initialSession={sessionData} links={navLinks} />
      </div>
    </NavbarContainer>
  );
}
