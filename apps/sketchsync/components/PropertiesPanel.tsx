import { ShapeStyles, ShapeType } from "@/canvas/types";

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
    "#1F2937", "#EF4444", "#F59E0B", "#10B981",
    "#3B82F6", "#8B5CF6", "#EC4899", "#F97316",
    "#14B8A6", "#E5E7EB",
  ];

  const fillColors = [
    "transparent",
    "#FFE3E3", "#FFF3BF", "#D3F9D8", "#C5F6FA",
    "#D0EBFF", "#E5DBFF", "#FDE2E4", "#F1F3F5",
  ];

  return (
    <div className="absolute right-3 top-15 bg-[#363541] p-3 rounded-[10px] z-50 w-52 text-white flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-[12px] text-gray-300">Stroke</h2>
        <div className="flex flex-wrap gap-2">
          {strokeColors.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ strokeColor: c })}
              className={`w-6 h-6 rounded-[7px] border-2 transition-transform ${
                style.strokeColor === c
                  ? "border-white scale-125"
                  : "border-transparent hover:scale-110"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      {(shapeType === "rect" || shapeType === "circle") && (
        <div className="flex flex-col gap-2">
          <h2 className="text-[12px] text-gray-300">Background</h2>
          <div className="flex flex-wrap gap-2">
            {fillColors.map((b) => (
              <button
                key={b}
                onClick={() => onChange({ fillColor: b })}
                className={`w-6 h-6 rounded-[7px] border-2 transition-transform ${
                  style.fillColor === b
                    ? "border-white scale-125"
                    : "border-transparent hover:scale-110"
                }`}
                style={{ backgroundColor: b }}
              />
            ))}
          </div>
        </div>
      )}
      {shapeType !== "text" && (
        <div className="flex flex-col gap-2">
          <h2 className="text-[12px] text-gray-300">Stroke style</h2>
          <div className="flex gap-2">
            {(["solid", "dashed", "dotted"] as const).map((size) => (
              <button
                key={size}
                onClick={() => onChange({ strokeSize: size })}
                className={`w-7 h-7 flex items-center justify-center rounded-[7px] transition-colors ${
                  style.strokeSize === size
                    ? "bg-[#403E6A]"
                    : "bg-[#2f2e38] hover:bg-[#3a3947]"
                }`}
              >
                <img
                  src={
                    size === "solid"
                      ? "/line.png"
                      : size === "dashed"
                        ? "/dashed-line.png"
                        : "/more.png"
                  }
                  className="w-3 h-3"
                  alt={size}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {shapeType !== "text" && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-[12px] text-gray-300">Stroke width</h2>
            <span className="text-[11px] text-gray-400 bg-[#2f2e38] px-2 py-0.5 rounded-md">
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
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6965db ${trackPercent}%, #4a4954 ${trackPercent}%)`
            }}
          />
        </div>
      )}
      {shapeType === "text" && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-[12px] text-gray-300">Font size</h2>
            <span className="text-[11px] text-gray-400 bg-[#2f2e38] px-2 py-0.5 rounded-md">
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
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6965db ${((style.fontSize ?? 16) - 12) / (72 - 12) * 100}%, #4a4954 ${((style.fontSize ?? 16) - 12) / (72 - 12) * 100}%)`
            }}
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-[12px] text-gray-300">Opacity</h2>
          <span className="text-[11px] text-gray-400 bg-[#2f2e38] px-2 py-0.5 rounded-md">
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
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6965db ${trackPercentOpacity}%, #4a4954 ${trackPercentOpacity}%)`
          }}
        />
      </div>
      
    </div>
  );
}