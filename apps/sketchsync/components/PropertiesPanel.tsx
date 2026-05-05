import React from "react";
// Assuming ShapeStyles and ShapeType are correctly imported from your types[cite: 1]
import { ShapeStyles } from "../canvas/types";

export default function PropertiesPanel({
  style,
  shapeType,
  onChange,
}: {
  style: ShapeStyles;
  shapeType: string | null;
  onChange: (style: Partial<ShapeStyles>) => void;
}) {
  const trackPercent = ((style.strokeWidth - 1) / (5 - 1)) * 100;
  const trackPercentOpacity = style.opacity * 100;

  const strokeColors = [
    "#ffffff", "#9ca3af", "#ef4444", "#f59e0b",
    "#10b981", "#3b82f6", "#8b5cf6", "#ec4899",
  ];

  const fillColors = [
    "transparent",
    "#fee2e2", "#fef3c7", "#d1fae5", "#dbeafe",
    "#ede9fe", "#fce7f3", "#f3f4f6", "#3f3f46",
  ];

  return (
    <div className="absolute right-4 top-24 bg-[#09090b]/80 backdrop-blur-xl border border-white/10 shadow-2xl p-4 rounded-2xl z-50 w-56 text-zinc-100 flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-xs font-medium text-zinc-400">Stroke Color</h2>
        <div className="flex flex-wrap gap-2">
          {strokeColors.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ strokeColor: c })}
              className={`w-5 h-5 rounded-full transition-all ${
                style.strokeColor === c
                  ? "ring-2 ring-zinc-300 ring-offset-2 ring-offset-[#09090b] scale-110"
                  : "hover:scale-110 border border-white/10"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {(shapeType === "rect" || shapeType === "circle") && (
        <div className="flex flex-col gap-2.5">
          <h2 className="text-xs font-medium text-zinc-400">Background</h2>
          <div className="flex flex-wrap gap-2">
            {fillColors.map((b) => (
              <button
                key={b}
                onClick={() => onChange({ fillColor: b })}
                className={`w-5 h-5 rounded-full transition-all relative overflow-hidden ${
                  style.fillColor === b
                    ? "ring-2 ring-zinc-300 ring-offset-2 ring-offset-[#09090b] scale-110"
                    : "hover:scale-110 border border-white/10"
                }`}
                style={{ backgroundColor: b === "transparent" ? "#18181b" : b }}
              >
                {b === "transparent" && (
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_45%,#ef4444_45%,#ef4444_55%,transparent_55%)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {shapeType !== "text" && (
        <div className="flex flex-col gap-2.5">
          <h2 className="text-xs font-medium text-zinc-400">Stroke Style</h2>
          <div className="flex gap-2">
            {(["solid", "dashed", "dotted"] as const).map((size) => (
              <button
                key={size}
                onClick={() => onChange({ strokeSize: size })}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  style.strokeSize === size
                    ? "bg-zinc-700 text-white shadow-inner"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
                }`}
              >
                <div className={`w-4 border-t-2 ${
                  size === "solid" ? "border-solid" : 
                  size === "dashed" ? "border-dashed" : 
                  "border-dotted"
                } border-current`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {shapeType !== "text" && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-medium text-zinc-400">Stroke Width</h2>
            <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded">
              {style.strokeWidth}px
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={style.strokeWidth}
            onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
            className="w-full h-1 rounded-full appearance-none cursor-pointer outline-none"
            style={{
              background: `linear-gradient(to right, #d4d4d8 ${trackPercent}%, #27272a ${trackPercent}%)`
            }}
          />
        </div>
      )}
      {shapeType === "text" && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-medium text-zinc-400">Font Size</h2>
            <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded">
              {style.fontSize ?? 16}px
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={72}
            step={2}
            value={style.fontSize ?? 16}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="w-full h-1 rounded-full appearance-none cursor-pointer outline-none"
            style={{
              background: `linear-gradient(to right, #d4d4d8 ${((style.fontSize ?? 16) - 12) / (72 - 12) * 100}%, #27272a ${((style.fontSize ?? 16) - 12) / (72 - 12) * 100}%)`
            }}
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-medium text-zinc-400">Opacity</h2>
          <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded">
            {Math.round(style.opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={style.opacity * 100}
          onChange={(e) => onChange({ opacity: Number(e.target.value) / 100 })}
          className="w-full h-1 rounded-full appearance-none cursor-pointer outline-none"
          style={{
            background: `linear-gradient(to right, #d4d4d8 ${trackPercentOpacity}%, #27272a ${trackPercentOpacity}%)`
          }}
        />
      </div>
      
    </div>
  );
}