import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { TestSection } from "@/components/home/test-section";
import { PracticeSection } from "@/components/home/practice-section";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      {/* <Hero />
      <TestSection />
      <PracticeSection />
      <Footer /> */}
    </main>
  );
}
