"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { 
  Square, Circle, Type, MousePointer2, 
  ArrowRight, Users, Zap, Sparkles, Command,
  Terminal, Shield, CheckCircle, Layers, Minus,
  Download, Plus, HelpCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  
  // Interactive state
  const [activeTool, setActiveTool] = useState<"pointer" | "rect" | "circle" | "text">("pointer");

  useGSAP(() => {
    // 1. Entrance animation timeline on load
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(".hero-badge", 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 }
    )
    .fromTo(".hero-title", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2 }, 
      "-=0.7"
    )
    .fromTo(".hero-sub", 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 }, 
      "-=0.8"
    )
    .fromTo(".hero-cta", 
      { y: 15, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8 }, 
      "-=0.7"
    )
    .fromTo(".hero-floating-card", 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1, stagger: 0.08, ease: "back.out(1.5)" }, 
      "-=0.8"
    );

    // Floating animation loop for individual cards
    gsap.utils.toArray(".hero-floating-card").forEach((card: any, i) => {
      gsap.to(card, {
        y: i % 2 === 0 ? -12 : 12,
        rotation: i % 2 === 0 ? 3 : -3,
        duration: 3.5 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // 2. Scroll Trigger: 3D perspective to flat MacBook rotation
    gsap.fromTo(mockupRef.current,
      {
        transform: "perspective(1200px) rotateX(16deg) scale(0.85) translateY(50px)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      },
      {
        transform: "perspective(1200px) rotateX(0deg) scale(1) translateY(0)",
        boxShadow: "0 30px 100px rgba(0,0,0,0.85)",
        scrollTrigger: {
          trigger: ".canvas-mockup-wrapper",
          start: "top bottom-=80",
          end: "bottom center+=150",
          scrub: 1.2,
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/20 pt-28 overflow-x-hidden">
      {/* 1. Hero Content & Tagline */}
      <div className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-20 min-h-[75vh] border-b border-white/5 gap-16 pb-20">
        <div className="absolute inset-0 -z-10" 
             style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px' }}>
        </div>
        
        <div className="flex flex-col gap-6 max-w-2xl relative z-10 text-left">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 w-fit px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Sparkles size={13} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">Introducing SketchSync 1.0</span>
          </div>

          {/* Heading */}
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1] tracking-tighter text-white">
            Site design. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Ship in real-time.</span> <br />
            Collaborate daily.
          </h1>

          {/* Subheading */}
          <p className="hero-sub text-base sm:text-lg text-zinc-400 max-w-lg font-medium leading-relaxed">
            The collaborative digital canvas built on an ultra-low latency monorepo. Form layouts, sketch freehand paths, and align shapes in sub-10ms.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex items-center gap-4 mt-2">
            <button 
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) {
                  router.push("/signin");
                } else {
                  router.push("/signup");
                }
              }}
              className="bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-3.5 rounded-xl font-bold text-sm tracking-tight flex items-center gap-2.5 transition active:scale-95 shadow-xl shadow-black/50 cursor-pointer"
            >
              Start sketching free <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => {
                mockupRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 px-6 py-3.5 rounded-xl font-bold text-sm tracking-tight transition active:scale-95 cursor-pointer"
            >
              Watch demo
            </button>
          </div>
        </div>
        
        {/* Floating elements visually indicating tools */}
        <div className="relative w-full md:w-1/2 h-[45vh] flex justify-center items-center">
          <div className="hero-floating-card absolute top-[15%] left-[5%] p-5 bg-zinc-900/40 border border-white/10 backdrop-blur-md shadow-2xl rounded-2xl">
            <Layers size={32} className="text-indigo-400" />
          </div>
          <div className="hero-floating-card absolute top-[5%] right-[20%] p-6 bg-zinc-900/40 border border-white/10 backdrop-blur-md shadow-2xl rounded-3xl">
            <Square size={44} className="text-pink-400" fill="currentColor" fillOpacity={0.08}/>
          </div>
          <div className="hero-floating-card absolute bottom-[15%] left-[20%] p-5 bg-zinc-900/40 border border-white/10 backdrop-blur-md shadow-2xl rounded-2xl">
            <Circle size={38} className="text-orange-400" fill="currentColor" fillOpacity={0.08}/>
          </div>
          <div className="hero-floating-card absolute top-[45%] right-[35%] p-4.5 bg-indigo-600 shadow-[0_20px_40px_rgba(99,102,241,0.3)] rounded-2xl">
            <MousePointer2 size={24} className="text-white" fill="white" />
          </div>
          <div className="hero-floating-card absolute bottom-[25%] right-[10%] p-5 bg-zinc-900/40 border border-white/10 backdrop-blur-md shadow-2xl rounded-2xl">
            <Type size={32} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* 2. GSAP 3D Scroll MacBook Mockup Area */}
      <div className="canvas-mockup-wrapper relative py-28 px-8 md:px-20 flex flex-col items-center bg-[#070708] border-b border-white/5 overflow-hidden">
        <div 
          ref={mockupRef}
          className="canvas-mockup flex flex-col items-center w-full max-w-4xl transition-all"
        >
          {/* MacBook Screen Chassis */}
          <div className="w-full bg-[#000000] border-4 border-[#1a1a1a] rounded-t-3xl p-1.5 relative shadow-2xl">
            {/* Camera notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-b-lg flex items-center justify-center gap-2 z-30">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-blue-900/30" />
            </div>

            {/* Screen Content */}
            <div className="w-full h-[450px] bg-[#0c0c0e] rounded-xl overflow-hidden flex flex-col border border-white/5 relative">
              
              {/* Mock Browser URL header inside Screen */}
              <div className="px-6 py-3 bg-[#09090b]/90 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-5 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-[10px] font-mono text-zinc-500 select-none">
                  sketchsync.com/room_alpha_99
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Sync Active</span>
                </div>
              </div>

              {/* Drawing Grid Mockup Area */}
              <div className="flex-1 relative overflow-hidden bg-[#09090b] select-none"
                   style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }}>
                  
                  {/* Mock Floating Toolbar */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-zinc-900/90 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-full z-20">
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-700/60 text-zinc-50 shadow-sm transition">
                      <MousePointer2 size={13} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200">
                      <Square size={13} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200">
                      <Circle size={13} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200">
                      <Type size={13} />
                    </button>
                  </div>

                  {/* Collaborative Cursors */}
                  <div className="absolute top-[28%] left-[25%] flex flex-col gap-1 z-10 animate-bounce" style={{ animationDuration: '3.2s' }}>
                    <div className="flex items-center gap-1.5">
                      <MousePointer2 size={18} className="text-indigo-400 fill-indigo-400" />
                      <div className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-extrabold rounded-md shadow-lg">
                        Prince
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-[52%] left-[65%] flex flex-col gap-1 z-10 animate-pulse">
                    <div className="flex items-center gap-1.5">
                      <MousePointer2 size={18} className="text-pink-400 fill-pink-400 -rotate-45" />
                      <div className="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-extrabold rounded-md shadow-lg">
                        Sophia
                      </div>
                    </div>
                  </div>

                  {/* Drawing vectors */}
                  <div className="absolute top-[32%] left-[12%] w-60 h-40 border border-dashed border-indigo-500/40 bg-indigo-500/5 rounded-xl flex flex-col p-4 justify-between shadow-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Card Element</span>
                    <div className="flex flex-col gap-2">
                      <div className="w-full h-2 bg-zinc-800 rounded" />
                      <div className="w-4/5 h-2 bg-zinc-800 rounded" />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800" />
                      <div className="w-12 h-4 bg-indigo-500/20 border border-indigo-500/30 rounded" />
                    </div>
                  </div>

                  <div className="absolute top-[18%] right-[22%] w-36 h-36 rounded-full border border-pink-500/60 bg-pink-500/10 flex items-center justify-center p-3 select-none text-center shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">Drawing Group</span>
                  </div>

                  {/* Connected Arrow SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                      <marker id="arrow-pointer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                      </marker>
                    </defs>
                    <path d="M 390 280 C 460 280, 490 250, 560 250" fill="transparent" stroke="#6366f1" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrow-pointer)" />
                  </svg>

                  {/* Properties Panel sidebar */}
                  <div className="absolute bottom-5 right-5 w-52 bg-zinc-900/90 border border-white/10 rounded-xl p-4 flex flex-col gap-3.5 shadow-xl z-20">
                    <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1.5">Canvas Config</span>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400 font-medium">Shape Fill</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-pink-500/20 border border-pink-500" />
                          <span className="font-mono text-zinc-300">#ec4899</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400 font-medium">Stroke Style</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-white border border-white/20" />
                          <span className="font-mono text-zinc-300">#ffffff</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* MacBook Keyboard/Deck Base */}
          <div className="w-[104%] h-4 bg-[#1e1e1f] border-t border-white/10 rounded-b-xl relative flex justify-center shadow-[0_15px_30px_rgba(0,0,0,0.65)]">
            <div className="w-28 h-1.5 bg-[#0e0e0f] rounded-b-md" />
          </div>
        </div>
      </div>

      {/* 3. Core Features Section (What it does) */}
      <div className="tech-section relative py-28 px-8 md:px-20 bg-[#09090b] border-b border-white/5">
        <div className="tech-title-animate flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <Zap size={13} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">Important Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Designed for real-time visual collaboration.
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed font-medium">
            Everything you need to sketch concepts, outline workflows, and export designs instantly with teammates.
          </p>
        </div>

        {/* 2x2 Tech Grid */}
        <div className="tech-grid grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Vector Shapes */}
          <div className="tech-card group p-8 bg-zinc-950 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Layers className="text-indigo-400 mb-4 transition group-hover:scale-105 duration-300" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Vector Shapes</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Draw clean vector shapes including rectangles, perfect circles, straight connection lines, and annotation text paths directly on an infinite canvas coordinates matrix.
            </p>
          </div>

          {/* Card 2: Cursors Sync */}
          <div className="tech-card group p-8 bg-zinc-950 border border-white/5 hover:border-pink-500/30 rounded-2xl transition duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Users className="text-pink-400 mb-4 transition group-hover:scale-105 duration-300" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">Collaborative Multi-Cursors</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Share workspace room links and sync with teammates instantly. View active cursor movements and badges in real-time as they sketch.
            </p>
          </div>

          {/* Card 3: Undo/Redo */}
          <div className="tech-card group p-8 bg-zinc-950 border border-white/5 hover:border-amber-500/30 rounded-2xl transition duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Terminal className="text-amber-400 mb-4 transition group-hover:scale-105 duration-300" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">Workspace History States</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Complete timeline management support. Traverse drawing coordinate histories with undo and redo controls, or clear the entire canvas board.
            </p>
          </div>

          {/* Card 4: Local Exporter */}
          <div className="tech-card group p-8 bg-zinc-950 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Download className="text-emerald-400 mb-4 transition group-hover:scale-105 duration-300" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">Instant Local Exporter</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Download your canvas configurations locally. Instantly export drawings to high-resolution PNG image snapshots directly inside your client browser.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Capabilities & Constraints (What it Can vs What it Cannot) */}
      <div className="capabilities-section relative py-24 px-8 md:px-20 bg-[#09090b] border-b border-white/5">
        <div className="capabilities-animate flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <Shield size={13} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">Capabilities Matrix</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Honest engineering limits.
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed font-medium">
            We are transparent about our features. Here is exactly what the SketchSync canvas can do today, and what is currently outside its scope.
          </p>
        </div>

        <div className="capabilities-grid grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* What it CAN do */}
          <div className="cap-card p-8 bg-zinc-950/60 border border-white/5 hover:border-emerald-500/20 rounded-2xl transition duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="text-emerald-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">What it Can Do</h3>
              </div>
              
              <ul className="flex flex-col gap-4 text-sm text-zinc-300 font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>Draw instant vector shapes: rectangles, circles, and straight connection lines.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>Synchronize multiple collaborators in separate rooms with low-latency WebSockets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>Modify shape styles including fill colors, border colors, stroke thickness, and opacity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>Navigate using an infinite 2D canvas with trackpad pan and mouse scroll controls.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>Download your canvas snapshot coordinates directly as standard PNG graphics.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* What it CANNOT do */}
          <div className="cap-card p-8 bg-zinc-950/60 border border-white/5 hover:border-rose-500/20 rounded-2xl transition duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Minus className="text-rose-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">What it Cannot Do</h3>
              </div>

              <ul className="flex flex-col gap-4 text-sm text-zinc-300 font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✘</span>
                  <span>Freehand pen sketch paths: Drawing curves or pencil strokes is currently disabled on the board.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✘</span>
                  <span>Re-arrange layer ordering: Elements are rendered sequentially; custom z-indexing is disabled.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✘</span>
                  <span>Embed external assets: You cannot drag-and-drop JPEG, SVG files, or videos into rooms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✘</span>
                  <span>Upload custom typography: Text tools are restricted to basic monospace standard sizing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✘</span>
                  <span>Recover cleared canvas databases: Once a host clears the room, states are deleted permanently.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Mock Canvas Tools Showcase Section */}
      <div className="gallery-section relative py-28 px-8 md:px-20 bg-[#09090b] border-b border-white/5">
        <div className="gallery-animate flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full">
            <Layers size={13} className="text-pink-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-pink-300">Toolbox Showcase</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Designed for precise creation.
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed font-medium">
            Explore the specialized client-side drawing tools available on SketchSync. Click a tool to view its generated vector component.
          </p>
        </div>

        {/* Gallery Container */}
        <div className="flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto items-stretch">
          {/* Left Side: Buttons / Selectors */}
          <div className="flex flex-col gap-3 lg:w-[40%]">
            {/* Tool 1: Pointer */}
            <button 
              onClick={() => setActiveTool("pointer")}
              className={`p-5 rounded-2xl border text-left transition duration-300 flex gap-4 items-start cursor-pointer
                ${activeTool === "pointer"
                  ? "bg-zinc-950 border-indigo-500/40 shadow-lg shadow-indigo-500/5 text-white" 
                  : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200"}`}
            >
              <MousePointer2 size={20} className={activeTool === "pointer" ? "text-indigo-400" : "text-zinc-500"} />
              <div>
                <h4 className="font-bold text-sm">Selection & Transform</h4>
                <p className="text-xs text-zinc-400 mt-1">Translate, resize, scale, and adjust selected shapes on coordinates.</p>
              </div>
            </button>

            {/* Tool 2: Rectangle */}
            <button 
              onClick={() => setActiveTool("rect")}
              className={`p-5 rounded-2xl border text-left transition duration-300 flex gap-4 items-start cursor-pointer
                ${activeTool === "rect"
                  ? "bg-zinc-950 border-indigo-500/40 shadow-lg shadow-indigo-500/5 text-white" 
                  : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200"}`}
            >
              <Square size={20} className={activeTool === "rect" ? "text-indigo-400" : "text-zinc-500"} />
              <div>
                <h4 className="font-bold text-sm">Rectangle Tool</h4>
                <p className="text-xs text-zinc-400 mt-1">Draw box containers, layout blocks, and geometric cards easily.</p>
              </div>
            </button>

            {/* Tool 3: Circle */}
            <button 
              onClick={() => setActiveTool("circle")}
              className={`p-5 rounded-2xl border text-left transition duration-300 flex gap-4 items-start cursor-pointer
                ${activeTool === "circle"
                  ? "bg-zinc-950 border-indigo-500/40 shadow-lg shadow-indigo-500/5 text-white" 
                  : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200"}`}
            >
              <Circle size={20} className={activeTool === "circle" ? "text-indigo-400" : "text-zinc-500"} />
              <div>
                <h4 className="font-bold text-sm">Circle Tool</h4>
                <p className="text-xs text-zinc-400 mt-1">Draw user avatar spaces, progress widgets, and status gauges.</p>
              </div>
            </button>

            {/* Tool 4: Text */}
            <button 
              onClick={() => setActiveTool("text")}
              className={`p-5 rounded-2xl border text-left transition duration-300 flex gap-4 items-start cursor-pointer
                ${activeTool === "text"
                  ? "bg-zinc-950 border-indigo-500/40 shadow-lg shadow-indigo-500/5 text-white" 
                  : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200"}`}
            >
              <Type size={20} className={activeTool === "text" ? "text-indigo-400" : "text-zinc-500"} />
              <div>
                <h4 className="font-bold text-sm">Text Annotator</h4>
                <p className="text-xs text-zinc-400 mt-1">Create text labels, custom codes, notes, and typography blocks.</p>
              </div>
            </button>
          </div>

          {/* Right Side: Interactive Preview Panel */}
          <div className="flex-1 min-h-[360px] bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden"
               style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1.5px, transparent 1.5px)`, backgroundSize: '16px 16px' }}>
            
            {/* Blur glow behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Conditionals based on activeTool */}
            {activeTool === "pointer" && (
              <div className="relative w-64 h-40 bg-zinc-900/20 border border-dashed border-indigo-400 rounded-xl flex items-center justify-center p-4">
                {/* Simulated coordinate info badge */}
                <div className="absolute top-3 left-4 px-2 py-0.5 bg-indigo-500 text-white rounded text-[9px] font-mono font-bold shadow-md">
                  X: 120, Y: 80, W: 240, H: 160
                </div>
                
                <div className="flex flex-col gap-2 items-center text-center">
                  <MousePointer2 className="text-indigo-400 animate-bounce" size={24} />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 font-mono">Active Transform State</span>
                </div>

                {/* Simulated resizing handles */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-indigo-400 border-2 border-zinc-950 rounded-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-indigo-400 border-2 border-zinc-950 rounded-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-indigo-400 border-2 border-zinc-950 rounded-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-indigo-400 border-2 border-zinc-950 rounded-sm" />
                <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-indigo-400 border-2 border-zinc-950 rounded-sm" />
                <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-indigo-400 border-2 border-zinc-950 rounded-sm" />
              </div>
            )}

            {activeTool === "rect" && (
              <div className="w-72 bg-zinc-900 border border-white/10 rounded-xl p-5 shadow-2xl flex flex-col gap-4.5 transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">ANALYTICS CARD</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">v1.2</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-extrabold text-white leading-none">Weekly Active Users</span>
                  <span className="text-[10px] text-zinc-500">Workspace rooms aggregate telemetry</span>
                </div>
                {/* Simulated CSS chart inside rectangle */}
                <div className="flex items-end gap-2.5 h-12 pt-2">
                  <div className="flex-1 bg-zinc-800 h-[30%] rounded-sm" />
                  <div className="flex-1 bg-zinc-800 h-[50%] rounded-sm" />
                  <div className="flex-1 bg-zinc-800 h-[40%] rounded-sm" />
                  <div className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 h-[85%] rounded-sm shadow-[0_0_12px_rgba(99,102,241,0.2)] animate-pulse" />
                  <div className="flex-1 bg-zinc-800 h-[65%] rounded-sm" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium pt-1.5 border-t border-white/5">
                  <span>Updated 2m ago</span>
                  <span className="text-white font-bold cursor-pointer hover:underline">View reports</span>
                </div>
              </div>
            )}

            {activeTool === "circle" && (
              <div className="w-64 bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-5 transition-all duration-500 hover:scale-[1.02]">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">PERFORMANCE DIAL</span>
                
                {/* Concentric Progress Rings */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#progress-glow)" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="55" strokeLinecap="round" className="animate-pulse" />
                    <defs>
                      <linearGradient id="progress-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#db2777" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-white">78%</span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">CPU Load</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sub-10ms latency lock</span>
                </div>
              </div>
            )}

            {activeTool === "text" && (
              <div className="w-80 bg-zinc-900 border border-white/10 rounded-xl p-5 shadow-2xl flex flex-col gap-4 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5 text-zinc-500">
                  <span>CANVAS_ENGINE_LOGGER</span>
                  <Terminal size={14} />
                </div>
                <div className="flex flex-col gap-2 text-zinc-400">
                  <div><span className="text-zinc-600">&gt;</span> <span className="text-indigo-400">const</span> manager = <span className="text-amber-400">new</span> <span className="text-emerald-400">CanvasManager</span>()</div>
                  <div><span className="text-zinc-600">&gt;</span> manager.registerTool(<span className="text-pink-400">&quot;rect&quot;</span>)</div>
                  <div className="flex items-center gap-1.5"><span className="text-zinc-600">&gt;</span> <span>manager.syncState()</span><span className="w-1.5 h-4 bg-indigo-400 animate-ping" /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Calling to Action Glow Block */}
      <div className="relative py-28 px-8 md:px-20 bg-[#070708] flex justify-center items-center border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="w-full max-w-4xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 p-12 md:p-16 rounded-3xl flex flex-col items-center gap-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-[80px]" />
          
          <div className="flex flex-col gap-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
              Ready to sync in real-time?
            </h2>
            <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed font-medium">
              Join thousands of developers sketching layouts, drafting architectures, and building shapes. Register an account and host rooms instantly.
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={() => router.push("/signup")}
              className="bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-3.5 rounded-xl font-bold text-sm tracking-tight flex items-center gap-2.5 transition active:scale-95 shadow-xl cursor-pointer"
            >
              Sign Up Free <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => router.push("/signin")}
              className="border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 px-6 py-3.5 rounded-xl font-bold text-sm tracking-tight transition active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* 7. Footer */}
      <footer className="py-16 px-8 md:px-20 bg-[#070708] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="logo" className="w-5 h-5 brightness-125" />
          <span className="text-sm font-bold text-white tracking-tight">SketchSync</span>
          <span className="text-xs text-zinc-600 ml-2">© 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-8 text-xs text-zinc-500 font-medium">
          <a href="#" className="hover:text-zinc-300 transition">Terms of Service</a>
          <a href="#" className="hover:text-zinc-300 transition">Privacy Policy</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition flex items-center gap-1">
            GitHub <ArrowRight size={12} />
          </a>
        </div>
      </footer>
    </div>
  );
}