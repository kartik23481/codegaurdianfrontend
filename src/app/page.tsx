"use client";

import Link from "next/link";
import { Brain, Terminal, Scale, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Master DSA with a <br className="hidden md:block"/>
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

        {/* Demo Section (Browser Window Mockup) */}
        <div className="mt-20 w-full max-w-4xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-pink-500/20 blur-3xl -z-10 rounded-full" />
          <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Browser Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-zinc-900">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Browser Content placeholder */}
            <div className="aspect-video bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              <p className="text-zinc-600 font-mono text-sm">[ Live Automation Demo GIF Placeholder ]</p>
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
