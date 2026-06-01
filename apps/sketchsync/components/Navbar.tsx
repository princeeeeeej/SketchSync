"use client";

import { BACKEND_URL } from "@/app/config";
import { X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar() {
  const router = useRouter();
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openJoinRoom, setOpenJoinRoom] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [roomNameCreate, setRoomNameCreate] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check in case page is refreshed while scrolled
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Entrance animation on mount
  useGSAP(() => {
    // Only animate from top if we aren't already scrolled down on mount
    if (!isScrolled) {
      gsap.fromTo(
        ".navbar-container",
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
      );
    }

    gsap.fromTo(
      ".navbar-item",
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  // 2. Performance-optimized GSAP transition for scroll toggling
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isScrolled) {
        // Instant configuration if refreshed while scrolled
        gsap.set(".navbar-container", {
          width: "90%",
          maxWidth: "1024px",
          borderRadius: "9999px",
          backgroundColor: "rgba(9, 9, 11, 0.85)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 24px 50px -12px rgba(0, 0, 0, 0.7)",
          paddingLeft: "32px",
          paddingRight: "32px",
          paddingTop: "14px",
          paddingBottom: "14px",
          y: 16,
          opacity: 1,
        });
      }
      return;
    }

    if (isScrolled) {
      // Smooth animation to floating pill
      gsap.to(".navbar-container", {
        width: "90%",
        maxWidth: "1024px",
        borderRadius: "9999px",
        backgroundColor: "rgba(9, 9, 11, 0.85)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 24px 50px -12px rgba(0, 0, 0, 0.7)",
        paddingLeft: "32px",
        paddingRight: "32px",
        paddingTop: "14px",
        paddingBottom: "14px",
        y: 16,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      // Smooth animation back to full header
      gsap.to(".navbar-container", {
        width: "100%",
        maxWidth: "100%",
        borderRadius: "0px",
        backgroundColor: "rgba(9, 9, 11, 0)",
        borderColor: "rgba(255, 255, 255, 0)",
        boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
        paddingLeft: "48px",
        paddingRight: "48px",
        paddingTop: "24px",
        paddingBottom: "24px",
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [isScrolled]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    router.push("/");
  };

  const handleCreateRoom = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/createRoom`, {
      method: "POST",
      headers: { Authorization: token!, "Content-Type": "application/json" },
      body: JSON.stringify({ name: roomNameCreate }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/canvas/${data.roomId}`);
    }
  };

  const handleJoinRoom = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/joinRoom`, {
      method: "POST",
      headers: { Authorization: token!, "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }
    router.push(`/canvas/${data.roomId}`);
  };

  return (
    <>
      {(openCreateRoom || openJoinRoom) && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300"
          onClick={() => {
            setOpenCreateRoom(false);
            setOpenJoinRoom(false);
          }}
        />
      )}
      {openCreateRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-sm bg-[#09090b] border border-white/10 rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                  New Room
                </span>
              </div>
              <button
                onClick={() => setOpenCreateRoom(false)}
                className="text-zinc-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Create a room
              </h2>
              <p className="text-sm text-zinc-400 -mt-2">
                Give your room a unique name to get started.
              </p>
              <input
                type="text"
                placeholder="my-design-room"
                onChange={(e) => setRoomNameCreate(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 placeholder-zinc-500 transition"
              />
              <button
                onClick={handleCreateRoom}
                className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-bold hover:bg-white transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Create Room <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
      {openJoinRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-sm bg-[#09090b] border border-white/10 rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                  Join Room
                </span>
              </div>
              <button
                onClick={() => setOpenJoinRoom(false)}
                className="text-zinc-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Join a room
              </h2>
              <p className="text-sm text-zinc-400 -mt-2">
                Enter the room ID shared with you.
              </p>
              <input
                type="text"
                placeholder="Room ID"
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder-zinc-500 transition"
              />
              <button
                onClick={handleJoinRoom}
                className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-bold hover:bg-white transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Join Room <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Centered Container Wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <nav
          className="navbar-container opacity-0 flex justify-between items-center pointer-events-auto border border-white/0 backdrop-blur-md w-full max-w-full rounded-none px-12 py-6 bg-transparent"
        >
          <Link href="/" className="navbar-item flex gap-2.5 items-center group">
            <img src="/logo.png" alt="logo" className="w-5 h-5 brightness-125" />
            <span className="text-[15px] font-bold tracking-tight text-white">
              SketchSync
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {!isAuth ? (
              <button
                onClick={() => router.push("/signin")}
                className="navbar-item px-5 py-2 bg-zinc-100 text-zinc-950 rounded-full text-sm font-bold hover:bg-white hover:scale-[1.02] transition active:scale-95 cursor-pointer shadow-md"
              >
                Sign In
              </button>
            ) : (
              <>
                <button
                  onClick={() => setOpenCreateRoom(true)}
                  className="navbar-item px-4 py-1.5 border border-white/10 text-zinc-200 rounded-full text-sm font-medium hover:bg-white/5 hover:text-white transition active:scale-95 cursor-pointer"
                >
                  Create Room
                </button>
                <button
                  onClick={() => setOpenJoinRoom(true)}
                  className="navbar-item px-4 py-1.5 border border-white/10 text-zinc-200 rounded-full text-sm font-medium hover:bg-white/5 hover:text-white transition active:scale-95 cursor-pointer"
                >
                  Join Room
                </button>
                <button
                  onClick={handleLogout}
                  className="navbar-item px-4 py-1.5 bg-zinc-800 border border-white/5 text-zinc-200 rounded-full text-sm font-medium hover:bg-zinc-700 hover:text-white transition active:scale-95 cursor-pointer"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}