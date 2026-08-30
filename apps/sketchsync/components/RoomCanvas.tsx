"use client";

import { WS_URL } from "@/app/config";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface TokenPayload {
  userId: string;
  name?: string;
}

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (!decoded?.userId) {
        localStorage.removeItem("token");
        router.push("/signin");
        return;
      }
      setUserId(decoded.userId);
      setUserName(decoded.name ?? "Anonymous");
    } catch (e) {
      console.error("Invalid token:", e);
      localStorage.removeItem("token");
      router.push("/signin");
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setWebSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    return () => {
      ws.close();
    };
  }, [roomId, router]);

  if (!webSocket) {
    return (
      <div className="w-screen h-screen bg-[#fcfcfb] flex flex-col items-center justify-center gap-4">
        <img src="/logo.png" alt="SketchSync" className="w-8 h-8 opacity-90 animate-pulse" />
        <div className="flex items-center gap-2.5 text-stone-600 text-sm font-medium">
          <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
          Connecting to room <span className="font-mono font-bold text-stone-900">{roomId}</span>...
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Canvas
        roomId={roomId}
        socket={webSocket}
        userId={userId}
        name={userName}
      />
    </div>
  );
}