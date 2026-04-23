"use client";

import Link from "next/link";
import { BookOpen, PenTool, Play, ChevronRight } from "lucide-react";

const practices = [
  { 
    icon: BookOpen, 
    title: "Narrative Reading", 
    desc: "Engage with adaptive stories that evolve based on your vocabulary level.", 
    gradient: "from-blue-500/20 to-cyan-500/20" 
  },
  { 
    icon: PenTool, 
    title: "Precision Grammar", 
    desc: "Master complex structures with our contextual correction engine.", 
    gradient: "from-purple-500/20 to-pink-500/20" 
  },
  { 
    icon: Play, 
    title: "Immersive Audio", 
    desc: "Train your ear with real-world scenarios and various regional accents.", 
    gradient: "from-orange-500/20 to-red-500/20" 
  },
];

export function PracticeSection() {
  return (
    <section className="relative w-full bg-black py-32 text-white overflow-hidden">
      {/* Energy Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,113,227,0.15)_0,transparent_70%)]" />
      
      <div className="relative z-10 container mx-auto max-w-[1100px] px-4">
        <div className="mb-20 flex flex-col items-center text-center">
          <span className="text-[14px] font-bold uppercase tracking-widest text-primary">Dynamic Exercises</span>
          <h2 className="mt-4 text-[40px] sm:text-[56px] text-white">Interactive Training</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {practices.map((item, idx) => (
            <div 
              key={idx}
              className="group relative flex flex-col overflow-hidden rounded-[32px] bg-zinc-900/50 p-10 ring-1 ring-white/10 transition-all hover:bg-zinc-900 hover:ring-white/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100 ${item.gradient}`} />
              <div className="relative z-10">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-[24px] font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-zinc-400 leading-relaxed">{item.desc}</p>
                <Link href="#" className="mt-8 flex items-center gap-1 text-[15px] font-semibold text-primary">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
