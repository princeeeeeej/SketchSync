"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Pencil, Square, Circle, Type, MousePointer2, 
  ArrowRight, Users, Zap, Sparkles, Command 
} from "lucide-react";
import Navbar from "./Navbar";

export default function HeroPage() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.from(".hero-content > *", { 
            y: 30, 
            opacity: 0, 
            duration: 1.2, 
            stagger: 0.15 
        })
        .from(".floating-card", { 
            scale: 0.8, 
            opacity: 0, 
            duration: 1, 
            stagger: 0.1,
            ease: "back.out(1.2)" 
        }, "-=1")
        .from(".grid-line", {
            scaleX: 0,
            duration: 1.5,
            stagger: 0.1
        }, 0);

        gsap.utils.toArray(".floating-card").forEach((card: any, i) => {
            gsap.to(card, {
                y: i % 2 === 0 ? -15 : 15,
                rotation: i % 2 === 0 ? 2 : -2,
                duration: 3 + i,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }, { scope: container });

    const onFeatureEnter = (e: React.MouseEvent<HTMLDivElement>, color: string) => {
        const fill = e.currentTarget.querySelector(".fill-bg");
        const icon = e.currentTarget.querySelector(".icon-feature");
        gsap.to(fill, { scaleY: 1, backgroundColor: color, duration: 0.4, ease: "expo.out" });
        gsap.to(e.currentTarget.querySelectorAll(".text-content"), { color: "#fff", duration: 0.3 });
        gsap.to(icon, { color: "#fff", y: -5, duration: 0.3 });
    };

    const onFeatureLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const fill = e.currentTarget.querySelector(".fill-bg");
        const icon = e.currentTarget.querySelector(".icon-feature");
        gsap.to(fill, { scaleY: 0, duration: 0.4, ease: "expo.in" });
        gsap.to(e.currentTarget.querySelectorAll(".text-content"), { color: "#1a1a1a", duration: 0.3 });
        gsap.to(e.currentTarget.querySelector(".text-muted"), { color: "#64748b", duration: 0.3 });
        gsap.to(icon, { color: "#6366f1", y: 0, duration: 0.3 });
    };

    return (
        <div ref={container} className="flex flex-col h-screen bg-[#fafafa] text-[#1a1a1a] overflow-hidden selection:bg-indigo-100">
            <div className="relative flex items-center justify-between px-16 h-[70vh] border-b border-zinc-200">
                <div className="absolute inset-0 -z-10" 
                     style={{ backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
                </div>
                <div className="hero-content flex flex-col gap-6 max-w-2xl relative z-10">

                    <h1 className="text-7xl font-bold leading-[0.9] tracking-tighter">
                        Sketch. <br />
                        <span className="text-indigo-600">Collaborate.</span> <br />
                        Sync in real-time.
                    </h1>

                    <p className="text-lg text-slate-500 max-w-md font-medium leading-relaxed">
                        The infinite canvas for teams who design at the speed of thought. No lag, no friction, just pure creativity.
                    </p>
                </div>
                <div className="relative w-1/2 h-full flex justify-center items-center">
                    <div className="floating-card absolute top-[15%] left-[10%] p-5 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl border border-white/50 ring-1 ring-zinc-200/50">
                        <Pencil size={32} className="text-indigo-500" />
                    </div>
                    <div className="floating-card absolute top-[10%] right-[20%] p-6 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-white/50 ring-1 ring-zinc-200/50">
                        <Square size={44} className="text-pink-500" fill="currentColor" fillOpacity={0.1}/>
                    </div>
                    <div className="floating-card absolute bottom-[20%] left-[25%] p-5 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl border border-white/50 ring-1 ring-zinc-200/50">
                        <Circle size={38} className="text-orange-500" fill="currentColor" fillOpacity={0.1}/>
                    </div>
                    <div className="floating-card absolute top-[45%] right-[35%] p-4 bg-indigo-600 shadow-2xl shadow-indigo-200 rounded-2xl">
                        <MousePointer2 size={28} className="text-white" fill="white" />
                    </div>
                    <div className="floating-card absolute bottom-[25%] right-[15%] p-5 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl border border-white/50 ring-1 ring-zinc-200/50">
                        <Type size={32} className="text-blue-500" />
                    </div>
                </div>
            </div>
            <div className="flex items-stretch h-[20vh] w-full bg-white">
                <div className="group relative flex items-center justify-center w-[35%] border-r border-zinc-200 bg-[#fdfdfd] overflow-hidden transition-all duration-500 hover:w-[40%]">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <button className="bg-[#1a1a1a] hover:bg-black text-white px-10 py-4 rounded-xl font-bold text-sm tracking-tight flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-zinc-200">
                            Get started for free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">No credit card required</p>
                    </div>
                </div>
                <div 
                    className="footer-item relative flex flex-col justify-center px-10 flex-1 border-r border-zinc-200 overflow-hidden cursor-pointer"
                    onMouseEnter={(e) => onFeatureEnter(e, "#6366f1")}
                    onMouseLeave={onFeatureLeave}
                >
                    <div className="fill-bg absolute inset-0 origin-bottom scale-y-0 -z-10"></div>
                    <Users className="icon-feature text-indigo-600 mb-3 transition-all" size={22} />
                    <h4 className="text-content font-bold text-sm uppercase tracking-wider">Multiplayer</h4>
                    <p className="text-content text-muted text-xs text-slate-500 mt-1">Real-time presence and engine-level sync.</p>
                </div>
                <div 
                    className="footer-item relative flex flex-col justify-center px-10 flex-1 border-r border-zinc-200 overflow-hidden cursor-pointer"
                    onMouseEnter={(e) => onFeatureEnter(e, "#ec4899")}
                    onMouseLeave={onFeatureLeave}
                >
                    <div className="fill-bg absolute inset-0 origin-bottom scale-y-0 -z-10"></div>
                    <Zap className="icon-feature text-indigo-600 mb-3 transition-all" size={22} />
                    <h4 className="text-content font-bold text-sm uppercase tracking-wider">Performance</h4>
                    <p className="text-content text-muted text-xs text-slate-500 mt-1">Built on WebSockets for sub-10ms latency.</p>
                </div>
                <div 
                    className="footer-item relative flex flex-col justify-center px-10 flex-1 overflow-hidden cursor-pointer"
                    onMouseEnter={(e) => onFeatureEnter(e, "#f59e0b")}
                    onMouseLeave={onFeatureLeave}
                >
                    <div className="fill-bg absolute inset-0 origin-bottom scale-y-0 -z-10"></div>
                    <Sparkles className="icon-feature text-indigo-600 mb-3 transition-all" size={22} />
                    <h4 className="text-content font-bold text-sm uppercase tracking-wider">OOP Design</h4>
                    <p className="text-content text-muted text-xs text-slate-500 mt-1">Extensible architecture for custom tools.</p>
                </div>

            </div>
        </div>
    );
}