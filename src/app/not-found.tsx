import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-[120px] font-bold tracking-tighter text-gradient sm:text-[180px]">
          404
        </h1>
        <h2 className="mt-[-20px] text-[24px] font-semibold text-white/90 sm:text-[32px]">
          Lost in space.
        </h2>
        <p className="mt-6 max-w-[440px] text-[17px] text-zinc-400 font-normal leading-relaxed">
          The page you're looking for doesn't exist or has been moved to a different dimension.
        </p>
        <Link
          href="/"
          className="mt-12 pill flex h-[48px] items-center gap-2 bg-white px-8 text-[15px] font-bold text-black transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Safety
        </Link>
      </div>
      
      <footer className="absolute bottom-8 text-[12px] text-zinc-600">
        © 2026 Antigravity Inc.
      </footer>
    </main>
  );
}
