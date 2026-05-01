export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
        <div className="relative h-full w-full rounded-2xl bg-zinc-900 ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
          <div className="h-8 w-8 rounded bg-primary animate-bounce shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
