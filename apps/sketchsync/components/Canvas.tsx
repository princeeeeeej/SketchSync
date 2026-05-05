"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasManager } from "../canvas/CanvasManager";
import { ShapeStyles, Tool } from "../canvas/types";

import { BACKEND_URL } from "@/app/config";
import PropertiesPanel from "./PropertiesPanel";
import { ToolBar } from "./ToolBaar";
import { AvatarStack } from "./AvatarStack";

let lastCursorSend = 0;
let lastPreviewSend = 0;

export default function Canvas({
  roomId,
  socket,
  userId,
  name,
}: {
  roomId: string;
  socket: WebSocket;
  userId: string;
  name: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<CanvasManager | null>(null);
  const [active, setActive] = useState<Tool>("pointer");
  const [textInput, setTextInput] = useState<{
    canvasX: number;
    canvasY: number;
    screenX: number;
    screenY: number;
    value: string;
  } | null>(null);
  const [selectedShapeStyles, setSelectedShapeStyles] =
    useState<ShapeStyles | null>(null);
  const [selectedShapeType, setSelectedShapeType] = useState<string | null>(
    null,
  );
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [collaborators, setCollaborators] = useState<
    Record<string, { id: string; name: string }>
  >({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const manager = new CanvasManager(
      canvas,
      (shape) => {
        if (socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify({ type: "draw", elements: shape, roomId }));
        socket.send(JSON.stringify({ type: "save", elements: shape, roomId }));
      },
      (ids) => {
        if (socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify({ type: "erase", ids, roomId }));
        setTimeout(() => {
          const shapes = managerRef.current?.getAllShapes() ?? [];
          socket.send(
            JSON.stringify({ type: "save", elements: shapes, roomId }),
          );
        }, 100);
      },
      (x, y) => {
        socket.send(
          JSON.stringify({ type: "cursor", x, y, roomId, userId, name }),
        );
      },
      (canvasX, canvasY, screenX, screenY) => {
        setTextInput({ canvasX, canvasY, screenX, screenY, value: "" });
      },
      (styles, shapeType) => {
        setSelectedShapeStyles(styles);
        setSelectedShapeType(shapeType);
      },
      () => {
        syncHistoryState();
      },
    );

    managerRef.current = manager;

    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/canvas/${roomId}`, {
      headers: { authorization: token ?? "" },
    })
      .then((res) => res.json())
      .then((data) => manager.loadShapes(data.elements) ?? [])
      .catch((err) => {
        console.log(err);
      });

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!managerRef.current) return;

      if (message.type === "draw")
        managerRef.current.onRemoteDraw(message.elements);
      if (message.type === "erase")
        managerRef.current.onRemoteErase(message.ids);
      if (message.type === "snapshot")
        managerRef.current.onRemoteDraw(message.data.elements ?? []);
      if (message.type === "cursor") {
        managerRef.current.updateCursor(
          message.userId,
          message.x,
          message.y,
          message.name,
        );
        setCollaborators((prev) => {
          if (!prev[message.userId]) {
            return {
              ...prev,
              [message.userId]: { id: message.userId, name: message.name },
            };
          }
          return prev;
        });
      }
      if (message.type === "preview") {
        if (message.element) {
          managerRef.current?.updatePreview(message.userId, message.element);
        }
      }
      if (message.type === "user_left") {
        managerRef.current.removeCursor(message.userId);
        setCollaborators((prev) => {
          const next = { ...prev };
          delete next[message.userId];
          return next;
        });
      }
      if (message.type === "request_snapshot") {
        const shapes = managerRef.current.getAllShapes();
        socket.send(
          JSON.stringify({
            type: "save",
            elements: shapes,
            roomId: message.roomId,
          }),
        );
      }
      if (message.type === "clear_preview") {
        managerRef.current.clearPreview(message.userId);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = 1 - e.deltaY * 0.005;
      managerRef.current?.zoomAt(e.offsetX, e.offsetY, factor);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  const handleToolChange = (tool: Tool) => {
    setActive(tool);
    managerRef.current?.setTool(tool);
  };

  const handleStyleChange = (partialStyle: Partial<ShapeStyles>) => {
    managerRef.current?.updateSelectedStyle(partialStyle);
    const fresh = managerRef.current?.getSelectedShapeStyles();
    setSelectedShapeStyles(fresh ? { ...fresh } : null);
  };

  const syncHistoryState = useCallback(() => {
    setCanUndo(managerRef.current?.canUndo() ?? false);
    setCanRedo(managerRef.current?.canRedo() ?? false);
  }, []);

  const commitText = () => {
    if (!textInput || !textInput.value.trim()) {
      setTextInput(null);
      return;
    }
    managerRef.current?.commitText(
      textInput.canvasX,
      textInput.canvasY,
      textInput.value,
    );
    setTextInput(null);
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-[#09090b]/80 backdrop-blur-md border border-white/10 shadow-sm rounded-full z-50">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-xs font-medium text-zinc-400">
          Room <span className="font-mono text-zinc-200 ml-1">{roomId}</span>
        </span>
      </div>
      <AvatarStack 
        users={[
          { id: userId, name: name }, 
          ...Object.values(collaborators) 
        ]} 
        currentUserId={userId} 
      />
      <canvas
        ref={canvasRef}
        style={
          active === "eraser"
            ? { cursor: "url('/eraser.svg') 5 5, auto" }
            : active === "hand"
              ? { cursor: "grab" }
              : {}
        }
        onPointerDown={(e) =>
          managerRef.current?.onPointerDown(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
          )
        }
        onPointerMove={(e) => {
          managerRef.current?.onPointerMove(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
          );
          const now = Date.now();
          if (now - lastCursorSend < 33) return;
          lastCursorSend = now;

          if (!managerRef.current) return;
          if (socket.readyState !== WebSocket.OPEN) return;

          const { x, y } = managerRef.current.toCanvasCoords(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
          );
          socket.send(
            JSON.stringify({ type: "cursor", x, y, roomId, userId, name }),
          );

          if (now - lastPreviewSend >= 16) {
            if (managerRef.current.isCurrentlyDrawing()) {
              const preview = managerRef.current.getCurrentShapeData();
              if (preview) {
                socket.send(
                  JSON.stringify({
                    type: "preview",
                    userId,
                    element: preview,
                    roomId,
                  }),
                );
              }
            }

            if (managerRef.current.isCurrentlyTransforming()) {
              const preview = managerRef.current.getTransformPreview();
              if (preview) {
                socket.send(
                  JSON.stringify({
                    type: "preview",
                    userId,
                    element: preview,
                    roomId,
                  }),
                );
              }
            }

            lastPreviewSend = now;
          }
        }}
        onPointerUp={(e) => {
          managerRef.current?.onPointerUp(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
          );
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "clear_preview",
                userId,
                roomId,
              }),
            );
          }
        }}
      />
      {textInput && (
        <textarea
          autoFocus
          className="absolute bg-transparent border-none outline-none text-white resize-none overflow-hidden"
          style={{
            left: textInput.screenX,
            top: textInput.screenY,
            fontSize: "16px",
            fontFamily: "monospace",
            minWidth: "100px",
            minHeight: "30px",
            lineHeight: "1.2",
            caretColor: "white",
            border: "1px solid red",
            zIndex: 1000,
          }}
          value={textInput.value}
          onChange={(e) =>
            setTextInput((prev) =>
              prev ? { ...prev, value: e.target.value } : null,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Escape") setTextInput(null);
            if (e.key === "Enter" && !e.shiftKey) commitText();
          }}
        />
      )}
      <ToolBar
        selectedTool={active}
        setSelectedTool={handleToolChange}
        onUndo={() => {
          managerRef.current?.undo();
          syncHistoryState();
        }}
        onRedo={() => {
          managerRef.current?.redo();
          syncHistoryState();
        }}
        onClear={() => {
          managerRef.current?.clearCanvas();
          console.log("Clear canvas clicked");
        }}
        onDownload={() => {
          managerRef.current?.exportPNG();
        }}
      />
      {selectedShapeStyles && (
        <PropertiesPanel
          style={selectedShapeStyles}
          onChange={handleStyleChange}
          shapeType={selectedShapeType}
        />
      )}
    </div>
  );
}
