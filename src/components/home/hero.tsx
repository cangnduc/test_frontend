"use server";
import Link from "next/link";
import Image from "next/image";
import { Play, ChevronRight, Sparkles } from "lucide-react";

export async function Hero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-20 text-center sm:pt-0">
      {/* Background Mesh/Glow */}
      <div className="absolute inset-0 -z-10 bg-mesh opacity-50 dark:opacity-100" />
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#0071e3]/20 blur-[120px] dark:bg-[#0071e3]/40" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#9b51e0]/20 blur-[120px] dark:bg-[#9b51e0]/40" />

      <div className="z-10 flex max-w-[900px] flex-col items-center gap-6">
        <div className="pill flex items-center gap-2 bg-primary/10 px-4 py-1 text-[13px] font-medium text-primary ring-1 ring-inset ring-primary/20 animate-in fade-in zoom-in duration-1000">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI-Powered English Learning</span>
        </div>

        <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 sm:text-[72px]">
          Master English with <br className="hidden sm:block" />
          <span className="text-gradient">Total Precision.</span>
        </h1>

        <p className="max-w-[650px] text-muted-foreground sm:text-[21px] font-normal leading-relaxed tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Experience a cinematic learning journey. Adaptive tests, immersive
          exercises, and real-time feedback designed to help you reach fluency
          faster.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link
            href="/tests"
            className="pill flex h-[48px] items-center justify-center bg-gradient-to-r from-[#0071e3] to-[#9b51e0] px-10 text-[17px] font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Get Started for Free
          </Link>
          <button className="flex items-center gap-1 text-[17px] font-medium text-foreground hover:opacity-70 transition-opacity">
            Watch the Demo <Play className="ml-1 h-4 w-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Hero Image - Blended with Background */}
      <div className="relative mt-16 w-full max-w-[1000px] px-6 animate-in fade-in slide-in-from-top-12 duration-1000">
        <div className="relative aspect-video w-full mask-radial">
          <Image
            src="/images/hero-v2.png"
            alt="Learning Universe"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
