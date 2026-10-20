"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  ShieldCheck, 
  RefreshCcw,
  Lock,
  Zap,
  Code2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#040405] text-zinc-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* ------------------------------------------------------------- */}
      {/* LIVING BACKGROUND ANIMATION (GPU Accelerated & Optimized)     */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        
        {/* Breathing ambient orbs - Hardware Accelerated */}
        <motion.div
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500 blur-[120px]"
        />
        <motion.div
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.04, 0.02] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-rose-500 blur-[120px]"
        />
        <motion.div
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-500 blur-[150px]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center relative z-10">
        
        {/* ------------------------------------------------------------- */}
        {/* HERO SECTION                                                  */}
        {/* ------------------------------------------------------------- */}
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

        {/* ------------------------------------------------------------- */}
        {/* SYSTEM CAPABILITIES RIBBON                                    */}
        {/* ------------------------------------------------------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mt-16 w-full max-w-5xl flex flex-col md:flex-row bg-[#060608]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/5"
        >
          {/* Capability 1: Complex Problem Solving */}
          <div className="flex-1 p-8 text-left relative group hover:bg-white/[0.02] transition-colors">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-5 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.15em] mb-2.5">Deep Synthesis</h3>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Engineered to interpret complex DSA constraints and generate highly optimized, memory-efficient logic sequences.
            </p>
          </div>

          {/* Capability 2: Self-Healing Loop */}
          <div className="flex-1 p-8 text-left relative group hover:bg-white/[0.02] transition-colors">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-5 shadow-[inset_0_0_15px_rgba(245,158,11,0.15)]">
              <RefreshCcw className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.15em] mb-2.5">Autonomous Healing</h3>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Automatically parses execution trace logs and hidden test failures to autonomously rewrite and correct its own code.
            </p>
          </div>

          {/* Capability 3: Maximum Fails Allowance */}
          <div className="flex-1 p-8 text-left relative group hover:bg-white/[0.02] transition-colors">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-5 shadow-[inset_0_0_15px_rgba(244,63,94,0.15)]">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.15em] mb-2.5">Deterministic Bounds</h3>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Strict maximum fail-turn allowances prevent infinite recursion, ensuring predictable and cost-effective execution pipelines.
            </p>
          </div>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* ELITE SAAS DEMO SECTION (Browser Mockup)                      */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-20 w-full max-w-5xl relative group perspective-[2000px] z-0">
          <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur-md opacity-30 transition-opacity duration-1000 group-hover:opacity-70" />
          
          <div className="relative rounded-xl border border-white/10 bg-[#09090b] shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden ring-1 ring-white/5 transition-transform duration-700 ease-out hover:scale-[1.01]">
            <div className="h-11 border-b border-white/5 bg-[#121214] flex items-center px-4 justify-between select-none">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5 group-hover:bg-red-500/80 transition-colors duration-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5 group-hover:bg-amber-500/80 transition-colors duration-300 delay-75" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5 group-hover:bg-emerald-500/80 transition-colors duration-300 delay-150" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/[0.03] border border-white/5 flex items-center gap-2 shadow-inner">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">codeguardian.ai / pipeline</span>
                </div>
              </div>
              <div className="w-[42px]" />
            </div>

            <div className="relative aspect-video bg-[#040405] overflow-hidden">
              <video
                src="/demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.01] opacity-90 transition-opacity duration-700 group-hover:opacity-100"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DEPLOYMENT-READY SPATIAL ARCHITECTURE DIAGRAM                 */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-40 w-full relative flex flex-col items-center pb-10">
          
          <div className="text-center mb-16 relative z-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">System Architecture</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              A precise map of the deterministic multi-agent loop, cloud execution flow, and automated rewriting cycles.
            </p>
          </div>

          <div className="w-full max-w-[1100px] bg-[#060608]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 shadow-2xl overflow-x-auto overflow-y-hidden custom-scrollbar relative">
            
            {/* Razor-sharp technical background grid inside Architecture */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

            <div className="min-w-[1050px] h-[780px] relative mx-auto z-10">
              <svg width="100%" height="100%" viewBox="0 0 1200 800" className="absolute inset-0">
                <defs>
                  {/* Standard Static Arrowhead */}
                  <marker id="arrow-base" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7" fill="none" stroke="#3F3F46" strokeWidth="1.5" />
                  </marker>
                </defs>

                {/* ========================================== */}
                {/* 1. BASE STATIC ROUTING WIRES (Dark grey)   */}
                {/* ========================================== */}
                <g fill="none" stroke="#27272A" strokeWidth="2.5" strokeDasharray="6 8" markerEnd="url(#arrow-base)">
                  <path d="M 220 120 C 280 120 280 185 340 185" /> {/* User -> Solver */}
                  <path d="M 440 230 L 440 300" />                 {/* Solver -> Exec */}
                  <path d="M 440 380 L 440 450" />                 {/* Exec -> Verif */}
                  <path d="M 440 530 L 440 600" />                 {/* Verif -> Ready */}
                  <path d="M 510 670 L 720 670" />                 {/* Ready -> Ext */}
                  <path d="M 370 670 C 90 670 90 185 340 185" />   {/* Ready -> Solver (NO) */}
                  <path d="M 940 670 C 1000 670 1000 590 1000 540"/>{/* Ext -> Status */}
                  <path d="M 1000 460 L 1000 340" />               {/* Status -> Verdict */}
                  <path d="M 1000 200 L 1000 120" />               {/* Verdict -> New Prob */}
                  <path d="M 930 270 C 740 270 740 185 540 185" /> {/* Verdict -> Solver (FAIL) */}
                </g>

                {/* ========================================== */}
                {/* 2. OPTIMIZED TELEMETRY PACKETS             */}
                {/* ========================================== */}
                {/* Removed SVG filters. Relying on high-contrast hex codes for natural glow */}
                <g fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 36">
                  
                  {/* Forward Paths (Cyan) */}
                  <g stroke="#22D3EE">
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 220 120 C 280 120 280 185 340 185" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 440 230 L 440 300" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 440 380 L 440 450" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 440 530 L 440 600" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                  </g>

                  {/* Submission Paths (Emerald) */}
                  <g stroke="#34D399">
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 510 670 L 720 670" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 940 670 C 1000 670 1000 590 1000 540" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 1000 460 L 1000 340" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 1000 200 L 1000 120" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                  </g>

                  {/* Feedback/Rewrite Paths (Rose) */}
                  <g stroke="#FB7185">
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 370 670 C 90 670 90 185 340 185" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                    <motion.path style={{ willChange: "stroke-dashoffset" }} d="M 930 270 C 740 270 740 185 540 185" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                  </g>
                </g>

                {/* ========================================== */}
                {/* 3. TEXT LABELS ON WIRES                    */}
                {/* ========================================== */}
                <text x="230" y="105" fill="#A1A1AA" fontSize="12" fontWeight="700" letterSpacing="1">Problem</text>
                
                <text x="280" y="660" fill="#FB7185" fontSize="14" fontWeight="800" letterSpacing="1">NO</text>
                <text x="520" y="660" fill="#34D399" fontSize="14" fontWeight="800" letterSpacing="1">YES</text>
                <text x="520" y="685" fill="#71717A" fontSize="11" fontWeight="600">(Conditions of Ready to submit)</text>
                
                <g transform="translate(680, 275)">
                   <text x="0" y="0" fill="#FB7185" fontSize="13" fontWeight="800" letterSpacing="1">Failed Test</text>
                   <text x="0" y="18" fill="#FB7185" fontSize="13" fontWeight="800" letterSpacing="1">Case Refixing</text>
                </g>

                {/* ========================================== */}
                {/* 4. STATIC HTML NODES (ForeignObjects)      */}
                {/* ========================================== */}
                
                {/* User Node */}
                <foreignObject x="60" y="85" width="160" height="70">
                  <div className="w-full h-full bg-[#121214] border border-white/10 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-[15px] font-bold text-white tracking-wide">User</span>
                  </div>
                </foreignObject>

                {/* Problem Solver Agent */}
                <foreignObject x="320" y="140" width="240" height="90">
                  <div className="w-full h-full bg-[#051114] border-2 border-cyan-500/40 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                    <span className="text-[15px] font-bold text-cyan-50 tracking-wide">Problem solver agent</span>
                  </div>
                </foreignObject>
                <foreignObject x="580" y="135" width="280" height="100">
                  <div className="w-full h-full flex flex-col justify-center">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1.5">(Responsibilities:</span>
                    <p className="text-[12px] leading-relaxed text-zinc-400 font-mono">
                      Analyzes constraints, designs edge-case simulations, synthesizes algorithms in Python/C++.)
                    </p>
                  </div>
                </foreignObject>

                {/* Code Executor Agent */}
                <foreignObject x="320" y="300" width="240" height="80">
                  <div className="w-full h-full bg-[#140e05] border-2 border-[#f59e0b]/40 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <span className="text-[15px] font-bold text-amber-50 tracking-wide">code executor agent</span>
                    <span className="text-[12px] font-medium text-amber-500/60 mt-1">(E2B safesandbox)</span>
                  </div>
                </foreignObject>
                <foreignObject x="580" y="290" width="280" height="100">
                  <div className="w-full h-full flex flex-col justify-center">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1.5">(Responsibilities:</span>
                    <p className="text-[12px] leading-relaxed text-zinc-400 font-mono">
                      Provisions secure cloud microVMs, safely executes untrusted AST scripts, captures telemetry.)
                    </p>
                  </div>
                </foreignObject>

                {/* Verifier Agent */}
                <foreignObject x="320" y="450" width="240" height="80">
                  <div className="w-full h-full bg-[#080814] border-2 border-indigo-500/40 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                    <span className="text-[15px] font-bold text-indigo-50 tracking-wide">Verifier agent</span>
                  </div>
                </foreignObject>
                <foreignObject x="580" y="440" width="280" height="100">
                  <div className="w-full h-full flex flex-col justify-center">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1.5">(Responsibilities:</span>
                    <p className="text-[12px] leading-relaxed text-zinc-400 font-mono">
                      Cross-references outputs deterministically, triggers automatic rewriting state loops on failure.)
                    </p>
                  </div>
                </foreignObject>

                {/* Ready To Submit Diamond */}
                <foreignObject x="370" y="600" width="140" height="140">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[100px] h-[100px] bg-[#0c0c0e] border border-white/20 shadow-xl flex items-center justify-center rotate-45">
                      <div className="rotate-[-45deg] text-center">
                        <span className="text-[13px] font-bold text-white leading-tight block">Ready to<br/>Submit</span>
                      </div>
                    </div>
                  </div>
                </foreignObject>

                {/* Extension Node */}
                <foreignObject x="720" y="630" width="220" height="80">
                  <div className="w-full h-full bg-[#14050d] border-2 border-pink-500/30 rounded-2xl flex items-center justify-center text-center shadow-[0_0_20px_rgba(236,72,153,0.1)]">
                    <span className="text-[14px] font-bold text-white leading-snug">Leetcode auto<br/>Submission<br/>Extension</span>
                  </div>
                </foreignObject>

                {/* Submission Status Node */}
                <foreignObject x="890" y="460" width="220" height="80">
                  <div className="w-full h-full bg-[#121214] border-2 border-white/10 rounded-2xl flex items-center px-6 text-center shadow-lg">
                    <span className="text-[14px] font-bold text-white leading-snug w-full">Leetcode problem<br/>submission status</span>
                  </div>
                </foreignObject>

                {/* Accepted or Not Diamond */}
                <foreignObject x="930" y="200" width="140" height="140">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[100px] h-[100px] bg-[#0c0c0e] border border-white/20 shadow-xl flex items-center justify-center rotate-45">
                      <div className="rotate-[-45deg] text-center">
                        <span className="text-[13px] font-bold text-white leading-tight block">Accepted or<br/>Not</span>
                      </div>
                    </div>
                  </div>
                </foreignObject>

                {/* New Problem Node */}
                <foreignObject x="910" y="60" width="180" height="60">
                  <div className="w-full h-full bg-[#041208] border-2 border-emerald-500/40 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <span className="text-[15px] font-bold text-emerald-50 tracking-wide">New problem</span>
                  </div>
                </foreignObject>

              </svg>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TECHNICAL ARSENAL (Bento Grid)                                */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-32 w-full relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Enterprise-Grade Arsenal</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Every component is over-engineered for absolute reliability, speed, and deterministic execution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {/* Card 1: E2B MicroVMs */}
            <div className="bg-[#09090b] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/10 blur-[50px] -mr-10 -mt-10 group-hover:bg-[#f59e0b]/20 transition-colors" />
               <Lock className="w-8 h-8 text-[#f59e0b] mb-6 relative z-10" />
               <h3 className="text-lg font-bold text-white mb-3 relative z-10">Isolated MicroVMs</h3>
               <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
                 Untrusted candidate scripts run inside hardened E2B cloud sandboxes. Complete network isolation with 150ms cold-start boots.
               </p>
            </div>
            
            {/* Card 2: Sub-second Telemetry */}
            <div className="bg-[#09090b] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-colors" />
               <Zap className="w-8 h-8 text-cyan-400 mb-6 relative z-10" />
               <h3 className="text-lg font-bold text-white mb-3 relative z-10">Real-Time Telemetry</h3>
               <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
                 Streams stdout, stderr, and memory traces back to the reasoning agent instantly via WebSocket for microsecond correction loops.
               </p>
            </div>

            {/* Card 3: Seamless Integration */}
            <div className="bg-[#09090b] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] -mr-10 -mt-10 group-hover:bg-pink-500/20 transition-colors" />
               <Code2 className="w-8 h-8 text-pink-400 mb-6 relative z-10" />
               <h3 className="text-lg font-bold text-white mb-3 relative z-10">Zero-Config Injection</h3>
               <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
                 The local relay extension maps the verified AST directly to the DOM. No passwords, no API keys, no session hijacking.
               </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM CALL TO ACTION                                         */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-40 mb-10 w-full relative z-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#121214] to-[#040405] border border-white/10 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Stop guessing. Start shipping.
            </h2>
            <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-10">
              Deploy the multi-agent cluster and watch your algorithms optimize themselves in real-time.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-sm font-bold text-black bg-white rounded-full transition-all hover:scale-105 hover:bg-cyan-50 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Initialize Workspace &rarr;
            </Link>
          </div>
        </div>

      </div>

      <footer className="border-t border-white/5 py-8 text-center text-zinc-600 text-xs tracking-wider bg-[#040405] relative z-20">
        <p>&copy; {new Date().getFullYear()} CodeGuardian AI. All rights reserved.</p>
      </footer>
    </div>
  );
}