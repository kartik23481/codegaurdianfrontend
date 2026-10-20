"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Settings,
  ArrowLeft,
  Code2,
  Copy,
  Check,
  BrainCircuit,
  Activity,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CheckCircle,
  TerminalSquare,
  ChevronDown,
  ChevronUp,
  Download,
  Puzzle,
  ShieldCheck,
  Loader2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  source: string;
  content: string;
  type: "message" | "stop" | "error";
}

function sanitizeContent(content: string | undefined | null): string {
  if (!content) return "";
  let clean = content;
  clean = clean.split("[START]").join("");
  clean = clean.split("[END]").join("");
  clean = clean.split("[LEDGER START]").join("");
  clean = clean.split("[LEDGER END]").join("");
  clean = clean.replace(/Instruction to CODE_EXECUTOR_AGENT/gi, "");
  clean = clean.replace(/Instruction to VERIFIER_AGENT/gi, "");
  clean = clean.replace(/^code\s*=\s*"""/gm, "");
  clean = clean.replace(/TERMINATE/g, "");
  return clean.trim();
}

export default function Workspace() {
  // 🔥 DEVELOPMENT TOGGLE: Set to false to use your real FastAPI backend
  const USE_MOCK_API = false;

  const [task, setTask] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [slug, setSlug] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLiveExecuting, setIsLiveExecuting] = useState(false);
  const [activeAgent, setActiveAgent] = useState<"SOLVER" | "SYSTEM" | null>(null);
  const [isExtensionVerified, setIsExtensionVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [failingInput, setFailingInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [actualOutput, setActualOutput] = useState("");

  // 🔥 NEW: COLD START & API ROUTING STATES
  const [startupPhase, setStartupPhase] = useState(0);
  const [activeApiKeyIndex, setActiveApiKeyIndex] = useState(1);
  const [isApiExhausted, setIsApiExhausted] = useState(false);
  const [apiSwitchToast, setApiSwitchToast] = useState({ show: false, index: 1 });

  const startupMessages = [
    "Waking up remote execution cluster...",
    "Allocating secure E2B cloud sandboxes...",
    "Establishing encrypted telemetry bridge...",
    "Synchronizing AutoGen agent states...",
    "Awaiting primary AI node response..."
  ];

  // Cycle through messages while waiting for the first chunk of data
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && messages.length === 0) {
      interval = setInterval(() => {
        setStartupPhase((prev) => (prev + 1) % startupMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning, messages.length]);

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leftScrollRef.current) leftScrollRef.current.scrollTop = leftScrollRef.current.scrollHeight;
    if (rightScrollRef.current) rightScrollRef.current.scrollTop = rightScrollRef.current.scrollHeight;

    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      const src = (last.source || "").toUpperCase();
      if (src.includes("EXECUTOR") || src.includes("VERIFIER")) {
        setActiveAgent("SYSTEM");
      } else {
        setActiveAgent("SOLVER");
      }
    }
  }, [messages, showFeedback, showSuccess]);

  // --- ELEGANT MOCK ENGINE (Smooth Streaming Effect) ---
  const simulateMockStream = async (isFeedback: boolean) => {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const initialFlow: Message[] = [
      { source: "PROBLEM_SOLVER_AGENT", type: "message", content: "### Problem Understanding\nWe need to find two numbers in the array that add up to the target. A brute force approach takes `O(n^2)` time. We can optimize this to `O(n)` using a Hash Map to store previously seen values.\n\n### Final Solution Code\n```python\nclass Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        prevMap = {} # val : index\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in prevMap:\n                return [prevMap[diff], i]\n            prevMap[n] = i\n        return []\n```" },
      { source: "CODE_EXECUTOR_AGENT", type: "message", content: "Actual | Input: ([2, 7, 11, 15], 9) | Output: [0, 1] | Expected: [0, 1] | Non-Match\nActual | Input: ([3, 2, 4], 6) | Output: [1, 2] | Expected: [1, 2] | Match\nActual | Input: ([3, 3], 6) | Output: [0, 1] | Expected: [0, 1] | Match\n\n✅ Solution saved successfully." },
      { source: "VERIFIER_AGENT", type: "message", content: "1. Previous Manual Rewrites: 0\n2. Current Execution Status: Yes\n3. New Manual Fail Total: 0\n\nCode verified successfully.\nCOMMAND: WRITE_SAVE_SCRIPT" },
      { source: "SYSTEM", type: "stop", content: "" }
    ];

    const feedbackFlow: Message[] = [
      { source: "PROBLEM_SOLVER_AGENT", type: "message", content: "### Failure Analysis\nThe previous solution failed on the edge case where the array contains negative numbers and zeros. I will adjust the logic to handle all integer constraints seamlessly while maintaining `O(n)` time complexity.\n\n### Corrected Solution\n```python\nclass Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Robust hash map implementation for all test cases\n        numMap = {}\n        n = len(nums)\n        for i in range(n):\n            complement = target - nums[i]\n            if complement in numMap:\n                return [numMap[complement], i]\n            numMap[nums[i]] = i\n        return []\n```" },
      { source: "CODE_EXECUTOR_AGENT", type: "message", content: "Actual | Input: ([-1, -2, -3, -4, -5], -8) | Output: [2, 4] | Expected: [2, 4] | Match\n\n✅ Solution saved successfully." },
      { source: "VERIFIER_AGENT", type: "message", content: "Code verified successfully after feedback round.\nCOMMAND: WRITE_SAVE_SCRIPT" },
      { source: "SYSTEM", type: "stop", content: "" }
    ];

    const flowToRun = isFeedback ? feedbackFlow : initialFlow;

    for (const msg of flowToRun) {
      if (msg.source === "PROBLEM_SOLVER_AGENT" && msg.type === "message") {
        // ⏱️ Full-proof waiting time for "Synthesizing..." animation before Solver starts writing
        await sleep(1500);

        // Elite Streaming Typewriter Effect
        const words = msg.content.split(" ");
        let currentText = "";

        // Add empty placeholder message
        setMessages(prev => [...prev, { ...msg, content: "" }]);

        for (let i = 0; i < words.length; i++) {
          currentText += words[i] + (i === words.length - 1 ? "" : " ");
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].content = currentText;
            return newMsgs;
          });
          // Speed optimized: Fast enough to not be annoying, slow enough to look authentic
          await sleep(25);
        }
      } else {
        // ⏱️ Realistic waiting time: 1.8s for Executor running & 1.8s for Verifier reasoning
        await sleep(1800);
        setMessages(prev => [...prev, msg]);
      }
    }


    setIsRunning(false);
    setActiveAgent(null);
  };


  // -------------------------------------------------------------

  const runTask = async (overrideTask?: string) => {
    const promptToRun = overrideTask || task;
    if (!promptToRun.trim() || isRunning) return;

    setIsRunning(true);
    setHasStarted(true);
    setShowFeedback(false);
    setShowSuccess(false);
    setIsFailed(false);
    setActiveAgent("SOLVER");

    // Reset routing states
    setActiveApiKeyIndex(1);
    setIsApiExhausted(false);
    setStartupPhase(0);

    // 🔥 FIX: Always register the user's input so the Solver knows to start thinking
    if (!overrideTask) {
      setMessages([
        { source: "USER_FEEDBACK", content: promptToRun, type: "message" }
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { source: "USER_FEEDBACK", content: promptToRun, type: "message" },
      ]);
    }

    if (USE_MOCK_API) {
      await simulateMockStream(!!overrideTask);
      return;
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${API_BASE}/api/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: promptToRun }),
      });

      if (!response.body) throw new Error("No response body received from server.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.startsWith("data: ")) {
              try {
                const jsonStr = trimmed.substring(6).trim();
                if (jsonStr) {
                  const parsed: any = JSON.parse(jsonStr);

                  // Intercept API Routing Signals
                  if (parsed.type === "API_SWITCH") {
                    setActiveApiKeyIndex(parsed.new_index);
                    setApiSwitchToast({ show: true, index: parsed.new_index });

                    // Auto-dismiss the floating notification after 3 seconds
                    setTimeout(() => {
                      setApiSwitchToast((prev) => ({ ...prev, show: false }));
                    }, 3000);
                    continue;
                  }

                  // Intercept Complete Exhaustion Signal
                  if (parsed.type === "API_EXHAUSTED") {
                    setIsApiExhausted(true);
                    setIsRunning(false);
                    return; // Stop processing stream
                  }

                  setMessages((prev) => [...prev, parsed as Message]);
                }
              } catch (parseErr) {
                console.error("SSE JSON parsing error:", parseErr, "Raw string:", trimmed);
              }
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { source: "SYSTEM", content: String(err), type: "error" },
      ]);
    } finally {
      setIsRunning(false);
      setActiveAgent(null);
    }
  };

  const extractFinalCode = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const src = (messages[i].source || "").toUpperCase();
      if (src.includes("SOLVER")) {
        const match = messages[i].content.match(/(class Solution:[\s\S]*?)(?:"""|```|$)/);
        if (match) return match[1].trim();
      }
    }
    return "";
  };


  // const verifyExtension = () => {
  //   setIsVerifying(true);

  //   if (USE_MOCK_API) {
  //     setTimeout(() => { setIsVerifying(false); setIsExtensionVerified(true); }, 1500);
  //     return;
  //   }

  //   let isResponded = false;

  //   // Listen for the PONG from the Chrome Extension relay
  //   const handlePingResponse = (event: MessageEvent) => {
  //     if (event.data?.type === "CODEGUARDIAN_PONG") {
  //       isResponded = true;
  //       setIsVerifying(false);
  //       setIsExtensionVerified(true);
  //       window.removeEventListener("message", handlePingResponse);
  //     }
  //   };

  //   window.addEventListener("message", handlePingResponse);
  //   window.postMessage({ type: "CODEGUARDIAN_PING" }, "*"); // Broadcast to window

  //   // Timeout if the extension isn't installed
  //   setTimeout(() => {
  //     if (!isResponded) {
  //       setIsVerifying(false);
  //       setIsExtensionVerified(false);
  //       window.removeEventListener("message", handlePingResponse);

  //       // 🔥 UPDATED EXPLICIT FAILURE FEEDBACK (No refresh needed)
  //       alert(
  //         "Bridge Connection Failed ⚠️\n\n" +
  //         "CodeGuardian could not detect the local extension.\n" +
  //         "Ensure the CodeGuardian Bridge is loaded and enabled in chrome://extensions/."
  //       );
  //     }
  //   }, 1500);
  // };

  const verifyExtension = () => {
    setIsVerifying(true);
    setVerificationError(null);

    if (USE_MOCK_API) {
      setTimeout(() => {
        setIsVerifying(false);
        setIsExtensionVerified(true);
      }, 1200);
      return;
    }

    const pingId = Math.random().toString(36).substring(7);
    let isResponded = false;

    const handlePingResponse = (event: MessageEvent) => {
      if (event.data?.type === "CODEGUARDIAN_PONG" && event.data?.pingId === pingId) {
        isResponded = true;
        setIsVerifying(false);
        setIsExtensionVerified(true);
        setVerificationError(null);
        window.removeEventListener("message", handlePingResponse);
      }
    };

    window.addEventListener("message", handlePingResponse);
    window.postMessage({ type: "CODEGUARDIAN_PING", pingId }, "*");

    setTimeout(() => {
      if (!isResponded) {
        setIsVerifying(false);
        setIsExtensionVerified(false);
        window.removeEventListener("message", handlePingResponse);
        // Inline warning state
        setVerificationError("Extension handshake failed. Please verify that the unpacked folder is loaded and active in chrome://extensions.");
      }
    }, 1500);
  };

  const handleLiveExecute = async () => {
    if (!slug.trim()) return;

    const finalCode = extractFinalCode();
    if (!finalCode) {
      alert("No solution code found in the current workspace to deploy.");
      return;
    }

    const payload = {
      type: "SUBMIT_SOLUTION",
      slug: slug.trim().toLowerCase(),
      code: finalCode,
      screenMeta: {
        width: window.screen.availWidth,
        height: window.screen.availHeight,
        left: window.screenX || window.screenLeft,
        top: window.screenY || window.screenTop,
      },
    };

    setIsLiveExecuting(true);

    // Listen for the success callback from the extension relay
    const handleSubmissionResponse = (event: MessageEvent) => {
      if (event.data?.type === "CODEGUARDIAN_SUBMISSION_COMPLETE") {
        setIsLiveExecuting(false);
        setShowFeedback(true);
        window.removeEventListener("message", handleSubmissionResponse);
      }
    };

    window.addEventListener("message", handleSubmissionResponse);
    window.postMessage(payload, "*"); // Broadcast payload to window
  };


  const handleFixIssue = () => {
    const prevCode = extractFinalCode();
    const feedbackPrompt = `
We previously attempted this problem, but it failed on LeetCode.

PREVIOUS SOLUTION:
\`\`\`python
${prevCode}
\`\`\`

FAILING TEST CASE:
Input: ${failingInput}
Expected Output: ${expectedOutput}
Actual Output: ${actualOutput}

Please analyze why the previous solution failed on this specific test case, and provide a corrected, optimal Python solution.
    `.trim();

    setFailingInput("");
    setExpectedOutput("");
    setActualOutput("");
    runTask(feedbackPrompt);
  };

  const handleAccepted = () => {
    setShowFeedback(false);
    setShowSuccess(true);
  };

  const resetWorkspace = () => {
    setTask("");
    setSlug("");
    setMessages([]);
    setHasStarted(false);
    setShowFeedback(false);
    setShowSuccess(false);
    setIsFailed(false);
    setActiveAgent(null);
  };

  const systemLogs = messages.filter((m) => {
    const src = (m.source || "").toUpperCase();
    return src.includes("EXECUTOR") || src.includes("VERIFIER");
  });

  // Filter out system stream noise to keep the UI clean
  const aiFlow = messages.filter((m) => {
    if (m.type === "stop") return false;
    const src = (m.source || "").toUpperCase();
    if (src.includes("EXECUTOR") || src.includes("VERIFIER")) return false;
    // Hide empty strings and AutoGen's raw 'USER' stream echoes
    if (src === "USER" || !m.content?.trim()) return false;
    return true;
  });


  const isFinished = messages.length > 0 && !isRunning && messages[messages.length - 1].type === "stop";

  // --- BULLETPROOF ANIMATION ROUTING ---
  // Find the last actual agent message, ignoring system noise or raw stream echoes
  const lastAgentMsg = [...messages].reverse().find((m) => {
    if (m.type === "stop" || m.type === "error") return false;
    const src = (m.source || "").toUpperCase();
    return (
      src.includes("USER") ||
      src.includes("SOLVER") ||
      src.includes("EXECUTOR") ||
      src.includes("VERIFIER")
    );
  });

  const lastAgentSource = (lastAgentMsg?.source || "").toUpperCase();

  // 1. SOLVER ACTIVE ("Synthesizing..." on Right Pane):
  // Holds until PROBLEM_SOLVER_AGENT delivers its complete solution.
  // Handles initial prompt ("USER" / "USER_FEEDBACK") and Verifier feedback loops.
  const isVerifierSuccess = lastAgentMsg?.content?.includes("Code verified successfully") || false;
  const isSolverThinking = isRunning && (
    lastAgentSource.includes("USER") ||
    (lastAgentSource.includes("VERIFIER") && !isVerifierSuccess)
  );

  // 2. EXECUTOR ACTIVE ("Allocating Isolated Environment..." on Left Pane):
  // Holds continuously from the moment Solver finishes writing until CODE_EXECUTOR_AGENT posts logs.
  const isExecutorRunning = isRunning && lastAgentSource.includes("SOLVER");

  // 3. VERIFIER ACTIVE ("Analyzing Execution Results..." on Left Pane):
  // Holds continuously from the moment Executor posts logs until VERIFIER_AGENT finishes reasoning.
  const isVerifierThinking = isRunning && lastAgentSource.includes("EXECUTOR");

  return (
    <div className="h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans overflow-hidden select-none selection:bg-cyan-500/20">
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#040405] z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link className="text-zinc-500 hover:text-zinc-200 transition-colors" href="/">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="font-medium text-sm tracking-wide text-white flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "bg-zinc-700"}`} />
            CodeGuardian
            {USE_MOCK_API && <span className="ml-2 text-[10px] bg-pink-500/10 text-pink-400 font-bold tracking-widest px-2 py-0.5 rounded border border-pink-500/20">MOCK STREAMING</span>}
          </div>
        </div>
      </header>

      {/* 🔥 FLOATING API ROUTING TOAST (Appears ONLY when backend switches key) */}
      <AnimatePresence>
        {apiSwitchToast.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            className="fixed top-20 right-6 z-[9999] pointer-events-none"
          >
            <div className="bg-[#1a1a1a] border border-[#f59e0b]/30 rounded-xl px-6 py-4 shadow-2xl shadow-[#f59e0b]/10 flex items-center gap-3 backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <div>
                <p className="text-xs font-bold text-[#f59e0b] uppercase tracking-widest">API NODE SWITCHED</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Now using <span className="text-white">Node #{apiSwitchToast.index}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="init-screen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/30 via-[#09090b] to-[#09090b]"
          >
            <div className="max-w-2xl w-full space-y-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[#121214] border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-2xl">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Initialize Workspace</h2>
                <p className="text-zinc-400 text-sm mt-2 font-medium">Submit DSA constraints to orchestrate the intelligence cluster.</p>
              </div>

              <div className="bg-[#0c0c0e] border border-white/10 rounded-xl p-2 shadow-2xl focus-within:border-cyan-500/40 transition-all duration-300">
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Paste LeetCode problem description here..."
                  className="w-full bg-transparent border-none text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-0 resize-none px-4 py-3 min-h-[140px] text-[13px] leading-relaxed custom-scrollbar font-medium"
                />
                <div className="flex justify-end p-2 border-t border-white/5">
                  <button
                    onClick={() => runTask()}
                    disabled={!task.trim()}
                    className="px-6 py-2 bg-white text-black rounded-md text-xs font-bold transition-transform hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-30 flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Execute Pipeline
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="workspace-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex overflow-hidden"
          >
            {/* LEFT PANE: Deployment Timeline */}
            <div className="w-[32%] border-r border-white/10 flex flex-col bg-[#09090b]">
              <div className="p-6 border-b border-white/5 bg-[#040405]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Original Task</div>
                <div className="text-xs font-medium text-zinc-300 line-clamp-3 leading-relaxed">{task}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar" ref={leftScrollRef}>
                <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-8 text-cyan-400">
                  <TerminalSquare className="w-4 h-4" /> Execution Trace
                </div>

                <div className="ml-1.5 space-y-0 pb-10">
                  {systemLogs.map((msg, idx) => (
                    <SystemLogBubble key={idx} message={msg} isLast={idx === systemLogs.length - 1} />
                  ))}

                  {/* ELITE EXECUTOR RUNNING STATE */}
                  {isExecutorRunning && (
                    <div className="relative pl-8 pt-4 pb-4">
                      {/* Minimalist Timeline Dot */}
                      <div className="absolute left-[3.5px] top-7 w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]" />

                      <div className="bg-[#09090b] border border-white/5 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0">
                          <TerminalSquare className="w-4 h-4 text-zinc-400" />
                        </div>

                        <div className="flex flex-col gap-1.5 w-full mt-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 font-medium">
                              Sandbox Execution
                            </span>
                            <span className="flex gap-0.5 ml-1">
                              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-1 h-1 bg-[#f59e0b] rounded-full" />
                              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1 h-1 bg-[#f59e0b] rounded-full" />
                              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1 h-1 bg-[#f59e0b] rounded-full" />
                            </span>
                          </div>
                          <span className="text-sm text-white leading-relaxed font-medium">
                            Allocating Isolated Environment...
                          </span>

                          <div className="mt-2 w-full h-[1px] bg-white/5 overflow-hidden rounded-full">
                            <motion.div
                              className="h-full bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent w-1/2"
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ELITE VERIFIER THINKING STATE */}
                  {isVerifierThinking && (
                    <div className="relative pl-8 pt-4 pb-4">
                      {/* Minimalist Timeline Dot */}
                      <div className="absolute left-[3.5px] top-7 w-1.5 h-1.5 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />

                      <div className="bg-[#09090b] border border-white/5 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4 text-zinc-400" />
                        </div>

                        <div className="flex flex-col gap-1.5 w-full mt-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                              State Verification
                            </span>
                            <span className="flex gap-0.5 ml-1">
                              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-1 h-1 bg-[#6366f1] rounded-full" />
                              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1 h-1 bg-[#6366f1] rounded-full" />
                              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1 h-1 bg-[#6366f1] rounded-full" />
                            </span>
                          </div>
                          <span className="text-sm text-white leading-relaxed font-medium">
                            Analyzing Execution Results...
                          </span>

                          <div className="mt-2 w-full h-[1px] bg-white/5 overflow-hidden rounded-full">
                            <motion.div
                              className="h-full bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent w-1/2"
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Intelligence & Actions */}
            <div className="w-[68%] flex flex-col bg-[#0c0c0e]">
              <div className="h-14 border-b border-white/5 flex items-center px-8 bg-[#09090b] shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" /> Solver Intelligence
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar" ref={rightScrollRef}>
                {/* 1. Chat History */}
                {aiFlow.map((msg, idx) => (
                  <SolverBubble key={idx} message={msg} initialTask={task} />
                ))}

                {/* 2. ELITE SAAS SOLVER THINKING STATE (Placed exactly below the chat) */}
                {isSolverThinking && !isApiExhausted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-8 flex items-start gap-4"
                  >
                    {/* Minimalist AI Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <BrainCircuit className="w-4 h-4 text-cyan-400" />
                    </div>

                    <div className="flex items-center h-9">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#121214] rounded-full border border-white/5 shadow-sm">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-1">
                          Synthesizing
                        </span>
                        <div className="flex gap-1.5">
                          <motion.div animate={{ scale: [0.7, 1, 0.7], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          <motion.div animate={{ scale: [0.7, 1, 0.7], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          <motion.div animate={{ scale: [0.7, 1, 0.7], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. NEW ELITE EXHAUSTION BLOCK (Only rendering once, at the bottom) */}
                {isApiExhausted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 mb-4 relative overflow-hidden rounded-2xl bg-[#09090b] border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.08)] p-10"
                  >
                    {/* Glowing top edge */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80" />

                    <div className="flex flex-col items-center text-center gap-5">
                      <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)] relative">
                        <div className="absolute inset-0 rounded-full border border-rose-500/30 animate-[ping_2s_ease-in-out_infinite]" />
                        <AlertCircle className="w-6 h-6 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                      </div>

                      <div className="space-y-2.5">
                        <h4 className="text-[13px] font-black text-rose-500 uppercase tracking-[0.25em]">
                          Compute Quota Exhausted
                        </h4>
                        <p className="text-[12px] text-zinc-400 font-medium max-w-md mx-auto leading-[1.8]">
                          All available administrator execution nodes (Keys 1-3) have reached their maximum rate limits. The deployment pipeline is temporarily suspended.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Pre-Submission Card / Extension Verification */}
                {isFinished && !showFeedback && !showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="p-7 rounded-2xl border border-white/10 bg-gradient-to-b from-[#121214] via-[#0e0e10] to-[#09090b] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden mt-8 ring-1 ring-white/5"
                  >
                    {/* Dynamic Top Edge Glow Accent */}
                    <div
                      className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-700 ${isExtensionVerified
                        ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                        : "bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
                        }`}
                    />

                    {!isExtensionVerified ? (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2.5">
                              <Puzzle className="w-3.5 h-3.5" />
                              Bridge Integration Required
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">
                              Pair Local LeetCode Runner
                            </h3>
                            <p className="text-xs font-medium text-zinc-400 mt-1 max-w-xl leading-relaxed">
                              Automated submission requires the local client bridge to inject solutions directly into your active LeetCode session without storing credentials.
                            </p>
                          </div>
                        </div>

                        {/* Installation Protocol Container */}
                        <div className="bg-[#09090b]/90 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center justify-between">
                            <span>Setup Protocol</span>
                            <span className="text-[9px] font-mono text-zinc-600">v1.0.0-PROD</span>
                          </div>

                          <ol className="space-y-4 text-xs font-medium text-zinc-300">
                            <li className="flex items-start gap-3.5">
                              <span className="flex-shrink-0 w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300 mt-0.5">
                                1
                              </span>
                              <div className="flex-1">
                                <span className="leading-relaxed">
                                  Download the verified extension bundle and unpack the ZIP on your machine.
                                </span>
                                <div className="mt-2.5">
                                  <a
                                    href="/codeguardian-extension.zip"
                                    download
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-white rounded-lg transition-all text-[11px] font-semibold border border-white/10 shadow-sm group"
                                  >
                                    <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                                    codeguardian-extension.zip
                                  </a>
                                </div>
                              </div>
                            </li>

                            <li className="flex items-start gap-3.5">
                              <span className="flex-shrink-0 w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300 mt-0.5">
                                2
                              </span>
                              <span className="leading-relaxed">
                                Open <code className="text-cyan-400 font-mono bg-cyan-400/10 border border-cyan-400/20 px-1.5 py-0.5 rounded text-[11px]">chrome://extensions</code> in a new tab.
                              </span>
                            </li>

                            <li className="flex items-start gap-3.5">
                              <span className="flex-shrink-0 w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300 mt-0.5">
                                3
                              </span>
                              <span className="leading-relaxed">
                                Enable <strong>Developer mode</strong> (top right), click <strong>Load unpacked</strong>, and select the folder containing <code className="text-white font-mono bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-[11px]">manifest.json</code>.
                              </span>
                            </li>
                          </ol>
                        </div>

                        <button
                          onClick={verifyExtension}
                          disabled={isVerifying}
                          className="w-full py-3.5 bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                        >
                          {isVerifying ? (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-zinc-900" />
                          )}
                          {isVerifying ? "Handshaking with Bridge..." : "Verify Bridge Connection"}
                        </button>

                        {/* Inline Red Warning with Asterisks */}
                        {verificationError && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-lg text-xs font-medium mt-1"
                          >
                            <span className="text-rose-500 font-black text-sm select-none leading-none mt-0.5">*</span>
                            <div className="flex-1 leading-relaxed">
                              <span className="font-bold text-rose-300 uppercase tracking-wider text-[10px] block mb-0.5">
                                * Connection Warning *
                              </span>
                              {verificationError}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Bridge Connected & Active
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Target: LeetCode DOM
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight">
                            Deploy Solution to LeetCode
                          </h3>
                          <p className="text-xs font-medium text-zinc-400 mt-1 leading-relaxed">
                            Specify the problem slug. CodeGuardian will inject the verified AST into the editor and dispatch the submission runner.
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="e.g. two-sum or Three Sum"
                              value={slug}
                              onChange={(e) => {
                                const formattedSlug = e.target.value
                                  .toLowerCase()
                                  .trim()
                                  .replace(/[^a-z0-9]+/g, "-");
                                setSlug(formattedSlug);
                              }}
                              className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
                            />
                            {slug && (
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan-400/70 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                slug: {slug}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={handleLiveExecute}
                            disabled={!slug.trim() || isLiveExecuting}
                            className="px-7 py-3 bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2.5 disabled:opacity-30 disabled:pointer-events-none shadow-[0_0_20px_rgba(6,182,212,0.35)] shrink-0"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Automate Submission
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Post-Submission Feedback */}
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-[#121214] to-[#09090b] shadow-2xl mt-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <h3 className="text-lg font-extrabold text-white mb-1.5 tracking-tight">Execution Telemetry</h3>
                    <p className="text-[13px] font-medium text-zinc-400 mb-8">Please confirm the remote sandbox results on LeetCode.</p>

                    {!isFailed ? (
                      <div className="flex gap-4">
                        {/* Solution Accepted Button */}
                        <button
                          onClick={handleAccepted}
                          className="group flex-1 py-3.5 px-5 bg-[#0c0c0e] hover:bg-emerald-950/20 border border-white/10 hover:border-emerald-500/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-emerald-400 transition-colors drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                          <span className="text-emerald-500 group-hover:text-emerald-400 font-bold tracking-widest uppercase text-[10px] transition-colors">
                            Solution Accepted
                          </span>
                        </button>

                        {/* Runtime Error / Failed Button */}
                        <button
                          onClick={() => setIsFailed(true)}
                          className="group flex-1 py-3.5 px-5 bg-[#0c0c0e] hover:bg-rose-950/20 border border-white/10 hover:border-rose-500/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <AlertCircle className="w-4 h-4 text-rose-500 group-hover:text-rose-400 transition-colors drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                          <span className="text-rose-500 group-hover:text-rose-400 font-bold tracking-widest uppercase text-[10px] transition-colors">
                            Runtime Error / Failed
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Failing Input Trigger</label>
                          <textarea value={failingInput} onChange={(e) => setFailingInput(e.target.value)} placeholder="e.g., nums = [3,2,4], target = 6" className="w-full bg-[#040405] border border-white/10 rounded-xl p-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-pink-500/50 min-h-[70px] shadow-inner" />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Actual Sandbox Output</label>
                            <textarea value={actualOutput} onChange={(e) => setActualOutput(e.target.value)} placeholder="e.g., [0, 1]" className="w-full bg-[#040405] border border-white/10 rounded-xl p-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-pink-500/50 min-h-[60px] shadow-inner" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Expected LeetCode Output</label>
                            <textarea value={expectedOutput} onChange={(e) => setExpectedOutput(e.target.value)} placeholder="e.g., [1, 2]" className="w-full bg-[#040405] border border-white/10 rounded-xl p-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-pink-500/50 min-h-[60px] shadow-inner" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                          <button onClick={() => setIsFailed(false)} className="px-6 py-2.5 text-zinc-400 hover:text-white text-xs font-bold transition-colors">Cancel</button>
                          <button onClick={handleFixIssue} disabled={!failingInput || !expectedOutput} className="px-7 py-2.5 bg-pink-600 text-white border border-pink-500 rounded-lg text-xs font-bold hover:bg-pink-500 disabled:opacity-30 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                            <Sparkles className="w-4 h-4" /> Synthesize Fix
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Final Success State */}
                {showSuccess && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-10 rounded-2xl border border-emerald-500/20 bg-[#121214] shadow-[0_0_30px_rgba(16,185,129,0.05)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Solution Accepted</h3>
                    <p className="text-xs font-medium text-zinc-400 mb-8 max-w-sm mx-auto">Excellent work. The verified algorithm was successfully executed and accepted by LeetCode.</p>
                    <button onClick={resetWorkspace} className="px-8 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mx-auto">
                      <Code2 className="w-4 h-4" />
                      Solve Next Problem
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLiveExecuting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#040405]/90 backdrop-blur-md">
            <div className="text-white text-xs font-mono tracking-[0.2em] uppercase font-bold flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)]" />
              Automating LeetCode Environment...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- UI COMPONENTS ----------------

// // ELITE LOG FORMATTER: Parses execution trace to add typographic styling without changing backgrounds
// const renderExecutionLog = (text: string) => {
//   return text.split('\n').map((line, i) => {
//     // Broadened check to catch both "Actual" and "Manual" test case lines
//     if (line.includes(" | Input:")) {
//       const parts = line.split(" | ");
//       return (
//         <div key={i} className="mb-2.5 flex flex-wrap gap-x-2 text-[12px] leading-relaxed">
//           {parts.map((part, j) => {
//             // Check for both Actual and Manual prefixes
//             if (part.startsWith("Actual") || part.startsWith("Manual")) {
//               return <span key={j} className="text-zinc-400 font-bold">{part}</span>;
//             }
//             if (part.startsWith("Input:")) return <span key={j}><span className="text-cyan-400 font-bold">Input:</span> <span className="text-white font-bold tracking-wide">{part.replace("Input:", "")}</span></span>;
//             if (part.startsWith("Output:")) return <span key={j}><span className="text-indigo-400 font-bold">Output:</span> <span className="text-white font-bold tracking-wide">{part.replace("Output:", "")}</span></span>;
//             if (part.startsWith("Expected:")) return <span key={j}><span className="text-amber-400 font-bold">Expected:</span> <span className="text-white font-bold tracking-wide">{part.replace("Expected:", "")}</span></span>;
//             if (part.toUpperCase() === "MATCH") return <span key={j} className="text-emerald-400 font-black uppercase tracking-widest">{part}</span>;
//             if (part.toUpperCase().includes("NON-MATCH") || part.toUpperCase().includes("ERROR") || part.toUpperCase().includes("FAILED")) return <span key={j} className="text-red-500 font-black uppercase tracking-widest">{part}</span>;
//             return <span key={j} className="text-zinc-100">{part}</span>;
//           })}
//         </div>
//       );
//     }
//     if (line.includes("Code verified successfully")) {
//       return <div key={i} className="text-emerald-400 font-bold mt-4 text-[12px] uppercase tracking-wider">{line}</div>;
//     }
//     if (line.includes("Solution saved successfully")) {
//       return <div key={i} className="text-emerald-400 font-bold mt-4 text-[12px] flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {line}</div>;
//     }
//     return <div key={i} className="text-white font-medium mb-1.5">{line}</div>;
//   });
// };

// function SystemLogBubble({ message, isLast }: { message: Message, isLast: boolean }) {
//   const src = (message.source || "").toUpperCase();
//   const isVerifier = src.includes("VERIFIER");
//   const clean = sanitizeContent(message.content);
//   if (!clean) return null;

//   return (
//     <div className="relative pl-8 pb-8 group">
//       {!isLast && <div className="absolute left-[3.5px] top-6 bottom-[-20px] w-[2px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" />}

//       <div className={`absolute left-[-2px] top-1.5 w-3 h-3 rounded-full ring-[4px] ring-[#09090b] ${isVerifier
//         ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.9)]'
//         : 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
//         }`} />

//       <div className="flex items-center gap-2 mb-3">
//         <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isVerifier ? 'text-indigo-400' : 'text-cyan-400'
//           }`}>
//           {isVerifier ? 'State Verification' : 'Execution Engine'}
//         </span>
//       </div>

//       <div className="text-[12px] font-mono text-zinc-100 whitespace-pre-wrap bg-[#121214] border border-white/10 rounded-xl p-5 shadow-2xl max-h-[250px] overflow-y-auto custom-scrollbar">
//         {renderExecutionLog(clean)}
//       </div>
//     </div>
//   );
// }


// ELITE LOG FORMATTER: High-contrast typography & deduplicated agent verdicts
const renderExecutionLog = (text: string, isVerifier: boolean) => {
  return text.split('\n').map((line, i) => {
    let cleanLine = line.replace('✅ ', '').trim();
    if (!cleanLine) return null;

    if (cleanLine.includes(" | Input:")) {
      const parts = cleanLine.split(" | ");
      return (
        <div key={i} className="mb-2.5 flex flex-wrap gap-x-2 text-[12px] leading-relaxed">
          {parts.map((part, j) => {
            if (part.startsWith("Actual") || part.startsWith("Manual")) {
              return <span key={j} className="text-zinc-400 font-bold">{part}</span>;
            }
            if (part.startsWith("Input:")) return <span key={j}><span className="text-cyan-400 font-bold">Input:</span> <span className="text-white font-bold tracking-wide">{part.replace("Input:", "")}</span></span>;
            if (part.startsWith("Output:")) return <span key={j}><span className="text-indigo-400 font-bold">Output:</span> <span className="text-white font-bold tracking-wide">{part.replace("Output:", "")}</span></span>;
            if (part.startsWith("Expected:")) return <span key={j}><span className="text-amber-400 font-bold">Expected:</span> <span className="text-white font-bold tracking-wide">{part.replace("Expected:", "")}</span></span>;
            if (part.toUpperCase() === "MATCH") return <span key={j} className="text-emerald-400 font-black uppercase tracking-widest">{part}</span>;
            if (part.toUpperCase().includes("NON-MATCH") || part.toUpperCase().includes("ERROR") || part.toUpperCase().includes("FAILED")) return <span key={j} className="text-red-500 font-black uppercase tracking-widest">{part}</span>;
            return <span key={j} className="text-white font-semibold">{part}</span>;
          })}
        </div>
      );
    }

    // High-contrast list styling (Image 3)
    if (cleanLine.match(/^\d+\./)) {
      return (
        <div key={i} className="text-white font-semibold font-mono text-[12px] mb-2 pl-3 border-l-2 border-indigo-500/40 tracking-wide">
          {cleanLine}
        </div>
      );
    }

    if (cleanLine.includes("Code verified successfully")) {
      return <div key={i} className="text-emerald-400 font-bold mt-4 text-[12px] uppercase tracking-wider">{cleanLine}</div>;
    }

    if (cleanLine.includes("COMMAND:")) {
      const parts = cleanLine.split(":");
      return (
        <div key={i} className="mt-3 mb-2 flex items-center gap-2 font-mono text-[12px] bg-white/5 border border-white/10 px-3 py-2 rounded-md w-max shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <span className="text-cyan-400">❯</span>
          <span className="text-zinc-400 font-bold tracking-widest">{parts[0]}:</span>
          <span className="text-white font-black tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            {parts.slice(1).join(":").trim()}
          </span>
        </div>
      );
    }

    // Agent deduplication
    // Agent deduplication & Elite Success Block
    if (cleanLine.includes("Solution saved successfully")) {
      if (isVerifier) {
        return (
          <div key={i} className="mt-5 flex items-start gap-3.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-l-[3px] border-emerald-400 pl-4 py-3.5 rounded-r-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <div className="flex flex-col gap-1">
              <span className="text-emerald-400 font-black uppercase tracking-[0.15em] text-[10px] drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]">
                Verification Complete
              </span>
              <span className="font-semibold text-[13px] tracking-wid">
                Code Verified & Ready for Submission
              </span>
            </div>
          </div>
        );
      }
      return (
        <div key={i} className="text-emerald-400 font-bold mt-4 text-[12px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 drop-shadow-[0_0_5px_rgba(52,211,153,0.6)]" />
          <span className="tracking-wide">{cleanLine}</span>
        </div>
      );
    }
    // Elevated brightness fallback
    return <div key={i} className="text-white font-semibold text-[12.5px] mb-1.5">{cleanLine}</div>;
  });
};

function SystemLogBubble({ message, isLast }: { message: Message, isLast: boolean }) {
  const src = (message.source || "").toUpperCase();
  const isVerifier = src.includes("VERIFIER");
  const clean = sanitizeContent(message.content);
  if (!clean) return null;

  return (
    <div className="relative pl-8 pb-8 group">
      {!isLast && <div className="absolute left-[3.5px] top-6 bottom-[-20px] w-[2px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" />}

      <div className={`absolute left-[-2px] top-1.5 w-3 h-3 rounded-full ring-[4px] ring-[#09090b] ${isVerifier
        ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.9)]'
        : 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
        }`} />

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isVerifier ? 'text-indigo-400' : 'text-cyan-400'
          }`}>
          {isVerifier ? 'State Verification' : 'Execution Engine'}
        </span>
      </div>

      <div className="text-[12px] font-mono text-zinc-100 whitespace-pre-wrap bg-[#121214] border border-white/10 rounded-xl p-5 shadow-2xl max-h-[250px] overflow-y-auto custom-scrollbar">
        {renderExecutionLog(clean, isVerifier)}
      </div>
    </div>
  );
}


// function SolverBubble({ message }: { message: Message }) {
//   const [expanded, setExpanded] = useState(false);

//   if (message.type === "stop") return null;

//   // CLAUDE-STYLE COLLAPSIBLE REFIX PROMPT
//   if (message.source === "USER_FEEDBACK") {
//     return (
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-8">
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="w-full flex items-center justify-between bg-[#121214] border border-white/10 hover:border-pink-500/50 transition-all duration-300 rounded-xl p-4 shadow-lg group"
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] group-hover:scale-110 transition-transform" />
//             <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-pink-400 group-hover:text-pink-300 transition-colors flex items-center gap-2">
//               <AlertCircle className="w-4 h-4" />
//               Execution Constraint Update Sent
//             </span>
//           </div>
//           <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
//             {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//           </div>
//         </button>

//         <AnimatePresence>
//           {expanded && (
//             <motion.div
//               initial={{ height: 0, opacity: 0, marginTop: 0 }}
//               animate={{ height: "auto", opacity: 1, marginTop: 12 }}
//               exit={{ height: 0, opacity: 0, marginTop: 0 }}
//               className="overflow-hidden"
//             >
//               <div className="bg-[#0c0c0e] border border-white/5 rounded-xl p-6 shadow-inner border-l-[3px] border-l-pink-500 relative">
//                 <div className="prose prose-invert max-w-none prose-p:text-white prose-p:leading-[1.8] prose-p:font-semibold prose-pre:bg-[#09090b] prose-pre:border prose-pre:border-white/10 text-[13px]">
//                   <ReactMarkdown
//                     components={{
//                       code: ({ node, inline, className, children, ...rest }: any) => {
//                         const match = /language-(\w+)/.exec(className || "");
//                         if (!inline && match) {
//                           return (
//                             <IDEBlock
//                               language={match[1]}
//                               value={String(children).replace(/\n$/, "")}
//                             />
//                           );
//                         }
//                         return (
//                           <code className="bg-white/10 text-cyan-300 font-bold px-1.5 py-0.5 rounded text-[12px] font-mono" {...rest}>
//                             {children}
//                           </code>
//                         );
//                       }
//                     }}
//                   >
//                     {message.content}
//                   </ReactMarkdown>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     );
//   }

//   const clean = sanitizeContent(message.content);
//   if (!clean) return null;

//   return (
//     <div className="text-[14px] text-white leading-relaxed mb-8">
//       {/* Upgraded High-Contrast Prose Typography */}
//       <div className="prose prose-invert max-w-none prose-p:leading-[1.85] prose-p:font-medium prose-p:text-zinc-100 prose-pre:p-0 prose-pre:bg-transparent prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight prose-strong:text-white prose-strong:font-extrabold prose-li:text-zinc-100 prose-li:font-medium">
//         <ReactMarkdown
//           components={{
//             code: ({ node, inline, className, children, ...rest }: any) => {
//               const match = /language-(\w+)/.exec(className || "");
//               if (!inline && match) {
//                 return (
//                   <IDEBlock
//                     language={match[1]}
//                     value={String(children).replace(/\n$/, "")}
//                   />
//                 );
//               }
//               return (
//                 <code className="bg-white/10 text-cyan-300 font-bold px-1.5 py-0.5 rounded text-[12px] font-mono border border-white/10" {...rest}>
//                   {children}
//                 </code>
//               );
//             }
//           }}
//         >
//           {clean}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// }
function SolverBubble({ message, initialTask }: { message: Message; initialTask: string }) {
  const [expanded, setExpanded] = useState(false);

  if (message.type === "stop") return null;

  if (message.source === "USER_FEEDBACK") {
    // Check if this message is the original user prompt
    const isInitial = message.content.trim() === initialTask.trim();

    if (isInitial) {
      // 1. Initial Prompt: Render as a sleek, premium right-aligned user bubble
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-end">
          <div className="bg-[#27272a] text-zinc-100 px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md font-medium text-[13px] leading-relaxed border border-white/5">
            {message.content}
          </div>
        </motion.div>
      );
    }

    // 2. Secondary Overrides: Render as the collapsible update box
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-8 flex justify-end">
        <div className="w-full max-w-[85%]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 rounded-xl p-4 shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pink-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-pink-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Execution Constraint Update
              </span>
            </div>
            <div className="text-pink-500/50 group-hover:text-pink-400 transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#0c0c0e] border border-white/5 rounded-xl p-5 shadow-inner border-r-[3px] border-r-pink-500 relative">
                  <div className="text-[12px] text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  const clean = sanitizeContent(message.content);
  if (!clean) return null;

  return (
    <div className="text-[14px] text-white leading-relaxed mb-8">
      <div className="prose prose-invert max-w-none prose-p:leading-[1.85] prose-p:font-medium prose-p:text-zinc-100 prose-pre:p-0 prose-pre:bg-transparent prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight prose-strong:text-white prose-strong:font-extrabold prose-li:text-zinc-100 prose-li:font-medium">
        <ReactMarkdown
          components={{
            code: ({ node, inline, className, children, ...rest }: any) => {
              const match = /language-(\w+)/.exec(className || "");
              if (!inline && match) {
                return (
                  <IDEBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, "")}
                  />
                );
              }
              return (
                <code className="bg-white/10 text-cyan-300 font-bold px-1.5 py-0.5 rounded text-[12px] font-mono border border-white/10" {...rest}>
                  {children}
                </code>
              );
            }
          }}
        >
          {clean}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function IDEBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-xl border border-white/10 bg-[#0d0d0f] overflow-hidden shadow-2xl ring-1 ring-black/50">
      {/* Elite IDE Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#121214] border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* macOS Style Window Controls */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.3)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_5px_rgba(245,158,11,0.3)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.3)]" />
          </div>
          <FileCode2 className="w-4 h-4 text-zinc-400" />
          <span className="text-[12px] font-bold font-mono text-zinc-300">
            {language === "python" ? "solution.py" : `snippet.${language}`}
          </span>
        </div>

        {/* Styled Premium Copy Button */}
        <button
          onClick={copy}
          className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Real Syntax Highlighting Canvas */}
      <div className="text-[13px] font-mono leading-[1.7] w-full overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language === "python" ? "python" : language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            fontSize: "13.5px",
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}