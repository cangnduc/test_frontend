"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface NavbarContainerProps {
  children: React.ReactNode;
  isMenuOpen?: boolean;
}

export function NavbarContainer({ children, isMenuOpen }: NavbarContainerProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-[60] w-full h-[48px] transition-all duration-300",
        isScrolled || isMenuOpen
          ? "bg-background/80 backdrop-blur-[20px] saturate-[180%] border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-full max-w-[980px] items-center justify-between px-4">
        {children}
      </div>
    </nav>
  );
}
