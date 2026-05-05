"use client";

import { BACKEND_URL } from "@/app/config";
import { X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openJoinRoom, setOpenJoinRoom] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [roomNameCreate, setRoomNameCreate] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
  }, []);

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
    if (!res.ok) { alert(data.message); return; }
    router.push(`/canvas/${data.roomId}`);
  };

  return (
    <>
      {(openCreateRoom || openJoinRoom) && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
          onClick={() => { setOpenCreateRoom(false); setOpenJoinRoom(false); }}
        />
      )}
      {openCreateRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-sm bg-[#fafafa] border border-zinc-200 rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">New Room</span>
              </div>
              <button onClick={() => setOpenCreateRoom(false)} className="text-zinc-400 hover:text-zinc-900 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Create a room</h2>
              <p className="text-sm text-zinc-500 -mt-2">Give your room a unique name to get started.</p>
              <input
                type="text"
                placeholder="my-design-room"
                onChange={(e) => setRoomNameCreate(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 placeholder-zinc-300 transition"
              />
              <button
                onClick={handleCreateRoom}
                className="w-full py-3 rounded-xl bg-[#1a1a1a] text-white text-sm font-semibold hover:bg-black transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Create Room <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
      {openJoinRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-sm bg-[#fafafa] border border-zinc-200 rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Join Room</span>
              </div>
              <button onClick={() => setOpenJoinRoom(false)} className="text-zinc-400 hover:text-zinc-900 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Join a room</h2>
              <p className="text-sm text-zinc-500 -mt-2">Enter the room ID shared with you.</p>
              <input
                type="text"
                placeholder="Room ID"
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400 placeholder-zinc-300 transition"
              />
              <button
                onClick={handleJoinRoom}
                className="w-full py-3 rounded-xl bg-[#1a1a1a] text-white text-sm font-semibold hover:bg-black transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Join Room <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
      <nav className="flex justify-between items-center px-10 py-5 h-[10vh] relative z-30">
        <Link href="/" className="flex gap-2.5 items-center group">
          <img src="/logo.png" alt="logo" className="w-5 h-5" />
          <span className="text-[15px] font-bold tracking-tight">SketchSync</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isAuth ? (
            <button
              onClick={() => router.push("/signin")}
              className="px-4 py-1.5 bg-[#1a1a1a] text-white rounded-full text-sm font-medium hover:bg-black transition active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <>
              <button
                onClick={() => setOpenCreateRoom(true)}
                className="px-4 py-1.5 border border-zinc-200 text-[#1a1a1a] rounded-full text-sm font-medium hover:border-zinc-400 hover:bg-zinc-50 transition active:scale-95 cursor-pointer"
              >
                Create Room
              </button>
              <button
                onClick={() => setOpenJoinRoom(true)}
                className="px-4 py-1.5 border border-zinc-200 text-[#1a1a1a] rounded-full text-sm font-medium hover:border-zinc-400 hover:bg-zinc-50 transition active:scale-95 cursor-pointer"
              >
                Join Room
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-[#1a1a1a] text-white rounded-full text-sm font-medium hover:bg-black transition active:scale-95 cursor-pointer"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}