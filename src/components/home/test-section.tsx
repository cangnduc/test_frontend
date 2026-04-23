"use client";

import Link from "next/link";
import Image from "next/image";
import { PenTool } from "lucide-react";

export function TestSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-24">
      {/* Subtle background glow */}
      <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

      <div className="container mx-auto flex max-w-[1000px] flex-col items-center gap-16 lg:flex-row lg:gap-24">
        <div className="relative aspect-square w-full max-w-[450px]">
          {/* Image blended with radial mask */}
          <div className="relative h-full w-full mask-radial">
            <Image
              src="/images/test-v2.png"
              alt="Assessment Engine"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
            />
          </div>
          {/* Added glow behind the image */}
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PenTool className="h-6 w-6" />
          </div>
          <h2 className="text-[40px] sm:text-[48px]">Smart Assessments.</h2>
          <p className="mt-6 max-w-[480px] text-[21px] text-muted-foreground leading-relaxed font-normal">
            Our AI analyzes your speech and writing in real-time, providing deep
            insights into your proficiency level. No more guessing—know exactly
            where you stand.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              href="/tests"
              className="pill flex h-[44px] items-center gap-2 bg-foreground px-8 text-[15px] font-semibold text-background transition-opacity hover:opacity-90"
            >
              Primary Test
            </Link>
            <Link
              href="#"
              className="pill flex h-[44px] items-center gap-2 border border-border bg-background px-8 text-[15px] font-semibold transition-colors hover:bg-muted"
            >
              How it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
