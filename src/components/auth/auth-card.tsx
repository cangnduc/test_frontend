"use client";

import { cn } from "@/lib/utils";

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="group relative w-full max-w-[440px]">
      {/* Outer glow */}
      <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl transition-all duration-1000 group-hover:from-primary/30 group-hover:to-purple-500/30" />
      
      <div className={cn(
        "relative flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-8 backdrop-blur-2xl shadow-2xl sm:p-10",
        className
      )}>
        {children}
      </div>
    </div>
  );
}

export function AuthInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-[52px] w-full rounded-2xl border border-white/5 bg-white/5 px-4 text-[15px] text-white placeholder:text-zinc-500 transition-all focus:border-primary/50 focus:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-primary/10",
        props.className
      )}
    />
  );
}

export function AuthButton({ children, isPending, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isPending?: boolean }) {
  return (
    <button
      {...props}
      disabled={isPending || props.disabled}
      className={cn(
        "pill flex h-[52px] w-full items-center justify-center bg-white text-[15px] font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100",
        props.className
      )}
    >
      {isPending ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
      ) : children}
    </button>
  );
}
