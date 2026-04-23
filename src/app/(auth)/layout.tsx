import { Navbar } from "@/components/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Background Mesh/Energy */}
      <div className="absolute inset-0 bg-mesh opacity-40 dark:opacity-60" />
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#9b51e0]/10 blur-[120px]" />

      <div className="relative z-10 flex flex-1 items-center justify-center p-4">
        {children}
      </div>

      <footer className="absolute bottom-8 w-full text-center text-[12px] text-zinc-600">
        © 2026 Antigravity Inc. Elevated Learning.
      </footer>
    </main>
  );
}
