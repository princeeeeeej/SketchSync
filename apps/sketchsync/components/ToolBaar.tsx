"use client";

import React, { cloneElement } from "react";
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Type, 
  Pencil, 
  Minus,
  Undo2,
  Redo2,
  Trash2,
  Hand,
  Download
} from "lucide-react";

interface ToolButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  label: string;
}

const ToolButton = ({ icon, active, onClick, label }: ToolButtonProps) => (
  <button
    onClick={onClick}
    title={label}

    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer
      ${active 
        ? "bg-zinc-700/60 text-zinc-50 shadow-sm"
        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
      }`}
  >
    {cloneElement(icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 16, strokeWidth: 1.75 })}
  </button>
);

export const ToolBar = ({ 
  selectedTool, 
  setSelectedTool,
  onUndo,
  onRedo,
  onClear,
  onDownload
}: any) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center p-1 bg-[#09090b]/80 backdrop-blur-md border border-white/10 shadow-lg rounded-full">
        <ToolButton 
          label="Select"
          icon={<MousePointer2 />} 
          active={selectedTool === "pointer"} 
          onClick={() => setSelectedTool("pointer")} 
        />
        <ToolButton label="hand" icon={<Hand />} active={selectedTool === "hand"} onClick={() => setSelectedTool("hand")} />
        <div className="w-[1px] h-4 bg-white/10 mx-1.5" />
        <ToolButton label="Rectangle" icon={<Square />} active={selectedTool === "rect"} onClick={() => setSelectedTool("rect")} />
        <ToolButton label="Circle" icon={<Circle />} active={selectedTool === "circle"} onClick={() => setSelectedTool("circle")} />
        <ToolButton label="Line" icon={<Minus />} active={selectedTool === "line"} onClick={() => setSelectedTool("line")} />
        <ToolButton label="Draw" icon={<Pencil />} active={selectedTool === "pen"} onClick={() => setSelectedTool("pen")} />
        <ToolButton label="Text" icon={<Type />} active={selectedTool === "text"} onClick={() => setSelectedTool("text")} />
        <div className="w-[1px] h-4 bg-white/10 mx-1.5" />
        <ToolButton label="Undo" icon={<Undo2 />} onClick={onUndo} />
        <ToolButton label="Redo" icon={<Redo2 />} onClick={onRedo} />
        <ToolButton 
          label="Clear" 
          icon={<Trash2 className="hover:text-rose-400 transition-colors" />} 
          onClick={onClear} 
        />
        <div className="w-[1px] h-4 bg-white/10 mx-1.5" />
        <ToolButton label="Download" icon={<Download />} onClick={onDownload} />
      </div>
    </div>
  );
};