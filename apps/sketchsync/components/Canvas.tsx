"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasManager } from "../canvas/CanvasManager";
import { ShapeStyles, Tool } from "../canvas/types";
import { ToolBar } from "./ToolBaar";
import { BACKEND_URL } from "@/app/config";
import PropertiesPanel from "./PropertiesPanel";
import { Redo2, Undo2 } from "lucide-react";

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

    fetch(`${BACKEND_URL}/canvas/${roomId}`)
      .then((res) => res.json())
      .then((data) => manager.loadShapes(data.elements) ?? []);

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
      }
      if (message.type === "preview") {
        if (message.element) {
          managerRef.current?.updatePreview(message.userId, message.element);
        }
      }
      if (message.type === "user_left") {
        managerRef.current.removeCursor(message.userId);
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
      <ToolBar active={active} setActive={handleToolChange} />
      {selectedShapeStyles && (
        <PropertiesPanel
          style={selectedShapeStyles}
          onChange={handleStyleChange}
          shapeType={selectedShapeType}
        />
      )}
      <div className="absolute bottom-3 left-3 rounded-[10px] bg-[#363541] flex z-50">
        <button
          className={`p-3 rounded-l-[10px] ${canUndo ? "hover:bg-[#4a4954] opacity-100 cursor-pointer" : "opacity-30 "}`}
          onClick={() => {
            managerRef.current?.undo();
            syncHistoryState();
          }}
          disabled={!canUndo}
        >
          <Undo2 color="white" className="h-3 w-3" />
        </button>
        <button
          className={`p-3 rounded-r-[10px] ${canRedo ? "hover:bg-[#4a4954] opacity-100 cursor-pointer" : "opacity-30 "}`}
          onClick={() => {
            managerRef.current?.redo();
            syncHistoryState();
          }}
          disabled={!canRedo}
        >
          <Redo2 color="white" className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
