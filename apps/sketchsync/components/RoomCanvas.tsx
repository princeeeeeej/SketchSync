"use client"

import { WS_URL } from "@/app/config";
import { useEffect, useState } from "react"
import Canvas from "./Canvas";
import { jwtDecode } from "jwt-decode"

interface TokenPayload {
  userId: string
  name?: string  
}

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return

    // decode token to get user info
    const decoded = jwtDecode<TokenPayload>(token)
    setUserId(decoded.userId)
    setUserName(decoded.name ?? "Anonymous")

    const ws = new WebSocket(`${WS_URL}?token=${token}`)

    ws.onopen = () => {
      setWebSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId }))
    }
  }, [])

  if (!webSocket) {
    return <div>Connecting to server...</div>
  }

  return (
    <div>
      <Canvas
        roomId={roomId}
        socket={webSocket}
        userId={userId}
        name={userName}
      />
    </div>
  )
}