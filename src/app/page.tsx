"use client";

import Link from "next/link";
import { Brain, Terminal, Scale, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Master DSA with a <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-zinc-200 to-pink-500">
            Multi-Agent AI Team.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10">
          CodeGuardian AI uses advanced intelligent agents to dynamically write, securely execute, and deterministically verify LeetCode solutions in real-time.
        </p>
        <Link
          href="/app"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-zinc-950 bg-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          Start Solving &rarr;
        </Link>

{/* Elite SaaS Demo Section (Browser Window Mockup) */}
        <div className="mt-24 w-full max-w-5xl relative group perspective-[2000px]">
          {/* Subtle, tight glow instead of a messy massive blur */}
          <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur-md opacity-30 transition-opacity duration-1000 group-hover:opacity-70" />
          
          <div className="relative rounded-xl border border-white/10 bg-[#09090b] shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden ring-1 ring-white/5 transition-transform duration-700 ease-out hover:scale-[1.01]">
            
            {/* Minimalist macOS Browser Header */}
            <div className="h-11 border-b border-white/5 bg-[#121214] flex items-center px-4 justify-between select-none">
              {/* Traffic Lights (Muted until hover for professionalism) */}
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5 group-hover:bg-red-500/80 group-hover:border-red-500/50 transition-colors duration-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5 group-hover:bg-amber-500/80 group-hover:border-amber-500/50 transition-colors duration-300 delay-75" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5 group-hover:bg-emerald-500/80 group-hover:border-emerald-500/50 transition-colors duration-300 delay-150" />
              </div>
              
              {/* Centered URL Bar */}
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/[0.03] border border-white/5 flex items-center gap-2 shadow-inner">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">codeguardian.ai / pipeline</span>
                </div>
              </div>
              
              {/* Spacer to balance the flex layout */}
              <div className="w-[42px]" />
            </div>

            {/* Premium Autoplay Video Player */}
            <div className="relative aspect-video bg-[#040405] overflow-hidden">
              {/* 
                scale-[1.01] is an elite UI trick to prevent 1px sub-pixel gaps 
                between the video edge and the container border on some monitors.
              */}
              <video
                src="/demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.01] opacity-90 transition-opacity duration-700 group-hover:opacity-100"
              />
              
              {/* Very subtle inner shadow to blend video edges into the frame */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Architecture (Bento Grid) */}
        <div className="mt-32 w-full">
          <h2 className="text-2xl font-semibold mb-10 text-zinc-200">The Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Solver */}
            <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Intelligent Code Generation</h3>
              <p className="text-zinc-400 text-sm">Analyzes constraints, designs edge-case tests, and writes optimal algorithms.</p>
            </div>

            {/* Executor */}
            <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                <Terminal className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Secure Cloud Execution</h3>
              <p className="text-zinc-400 text-sm">Runs untrusted code safely in isolated E2B microVM sandboxes.</p>
            </div>

            {/* Verifier */}
            <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20">
                <Scale className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Deterministic Verification</h3>
              <p className="text-zinc-400 text-sm">Validates outputs against expected results and orchestrates the agent loop.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CodeGuardian AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
