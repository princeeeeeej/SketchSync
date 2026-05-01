import { ShapeFactory } from "./ShapeFactory";
import { CircleShape } from "./shapes/CircleShape";
import { LineShape } from "./shapes/LineShape";
import { PenShape } from "./shapes/PenShape";
import { RectShape } from "./shapes/RectShape";
import { Shape } from "./shapes/shape";
import { TextShape } from "./shapes/TextShape";
import { DEFAULT_STYLE, Point, ResizeHandle, ShapeData, ShapeStyles, Tool } from "./types";

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shapes: Map<string, Shape>;
  private selectedShape: Shape | null;
  private activeTool: Tool;
  private startX: number = 0;
  private startY: number = 0;
  private panX: number;
  private panY: number;
  private zoom: number;
  private currentStyle: ShapeStyles;

  private isDrawing: boolean;
  private currentShape: Shape | null;
  private currentStroke: Point[];

  private lastRawX: number;
  private lastRawY: number;

  private isResizing: boolean;
  private activeHandle: ResizeHandle | null;
  private resizeStartX: number;
  private resizeStartY: number;
  private resizeStartData: ShapeData | null

  private moveStartX: number;
  private moveStartY: number;
  private originalShapeData: ShapeData | null;

  private erasedIds: Set<string>;

  private onShapeChange: (shapes: ShapeData[]) => void;
  private onErase: (ids: string[]) => void;
  private onCursorMove: (x: number, y: number) => void;
  private onTextRequest: (
    canvasX: number,
    canvasY: number,
    screenX: number,
    screenY: number,
  ) => void;
  private onSelectionChange: (
    shapeStyles: ShapeStyles | null,
    shapeType: string | null,
  ) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onShapeChange: (shapes: ShapeData[]) => void,
    onErase: (ids: string[]) => void,
    onCursorMove: (x: number, y: number) => void,
    onTextRequest: (
      canvasX: number,
      canvasY: number,
      screenX: number,
      screenY: number,
    ) => void,
    onSelectionChange: (
      shapeStyles: ShapeStyles | null,
      shapeType: string | null,
    ) => void,
  ) {
    this.canvas = canvas;
    this.currentStyle = DEFAULT_STYLE;
    this.ctx = canvas.getContext("2d")!;
    this.shapes = new Map();
    this.selectedShape = null;
    this.activeTool = "pointer";
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1;
    this.isDrawing = false;
    this.currentShape = null;
    this.currentStroke = [];
    this.lastRawX = 0;
    this.lastRawY = 0;
    this.moveStartX = 0;
    this.moveStartY = 0;
    this.originalShapeData = null;
    this.erasedIds = new Set();
    this.isResizing = false;
    this.activeHandle = null
    this.resizeStartX = 0;
    this.resizeStartY = 0;
    this.resizeStartData = null
    this.onShapeChange = onShapeChange;
    this.onErase = onErase;
    this.onCursorMove = onCursorMove;
    this.onTextRequest = onTextRequest;
    this.onSelectionChange = onSelectionChange;
  }

  toCanvasCoords(screenX: number, screenY: number) {
    return {
      x: (screenX - this.panX) / this.zoom,
      y: (screenY - this.panY) / this.zoom,
    };
  }

  getShape(x: number, y: number): Shape | null {
    const shapesArray = [...this.shapes.values()];
    for (let i = shapesArray.length - 1; i >= 0; i--) {
      if (shapesArray[i].hitTest(x, y)) return shapesArray[i];
    }
    return null;
  }

  setTool(tool: Tool) {
    this.activeTool = tool;
    this.onSelectionChange(null, null);
    this.selectedShape = null;
    this.render();
  }

  addShape(shape: Shape) {
    this.shapes.set(shape.id, shape);
  }

  setStyle(style: Partial<ShapeStyles>): void {
    this.currentStyle = { ...this.currentStyle, ...style };
  }

  getSelectedShapeStyles(): ShapeStyles | null {
    if (!this.selectedShape) return null;
    return { ...this.selectedShape.style };
  }

  getSelectedShape(): Shape | null {
    if (!this.selectedShape) return null;
    return this.selectedShape;
  }

  updateSelectedStyle(style: Partial<ShapeStyles>): void {
    if (!this.selectedShape) return;
    this.selectedShape.style = { ...this.selectedShape.style, ...style };
    if (
      this.selectedShape instanceof TextShape &&
      style.fontSize !== undefined
    ) {
      this.selectedShape.fontSize = style.fontSize;
    }
    this.shapes.set(this.selectedShape.id, this.selectedShape);
    this.render();
    this.onShapeChange([...this.shapes.values()].map((s) => s.serialize()));
  }

  getActiveHandle(x: number, y: number) : ResizeHandle | null{
    if(!this.selectedShape) return null

    const box = this.selectedShape.getBoundingBox()
    const tolerance = 6 / this.zoom

    const handles: {name: ResizeHandle, x: number, y: number}[] = [
      {name: "nw", x: box.x, y: box.y},
      {name: "n", x: box.x + box.width / 2, y: box.y},
      {name: "ne", x: box.x + box.width, y: box.y},
      {name: "w", x: box.x , y: box.y + box.height/2},
      {name: "sw", x: box.x, y: box.y + box.height},
      {name: "s", x: box.x + box.width/2, y: box.y + box.height},
      {name: "se", x: box.x + box.width, y: box.y + box.height},
      {name: "e", x: box.x + box.width, y: box.y + box.height/2}
    ]

    for(let handle of handles){
      const dx = x - handle.x
      const dy = y - handle.y
      if (Math.sqrt(dx*dx + dy*dy) < tolerance) return handle.name
    }
    return null
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(18, 18, 18)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.zoom, this.zoom);

    this.shapes.forEach((shape) => shape.draw(this.ctx));

    if (this.selectedShape) {
      this.selectedShape.drawSelection(this.ctx, this.zoom);
    }

    if (this.currentShape) {
      this.currentShape.draw(this.ctx);
    }

    this.ctx.restore();
  }

  onPointerDown(screenX: number, screenY: number) {
    const { x, y } = this.toCanvasCoords(screenX, screenY);

    switch (this.activeTool) {
      case "hand":
        this.lastRawX = screenX;
        this.lastRawY = screenY;
        this.isDrawing = true;
        break;
      case "pointer":
        if (this.selectedShape) {
          const handle = this.getActiveHandle(x, y);
          if (handle) {
            this.isResizing = true;
            this.isDrawing = true;  
            this.activeHandle = handle; 
            this.resizeStartX = x;
            this.resizeStartY = y;
            this.resizeStartData = JSON.parse(
              JSON.stringify(this.selectedShape.serialize())
            );
            return;
          }
        }

        const shape = this.getShape(x, y);
        this.selectedShape = shape;
        const handle = this.getActiveHandle(x, y)
        if (shape) {
          this.moveStartX = x;
          this.moveStartY = y;
          this.originalShapeData = shape.serialize();
          this.onSelectionChange({ ...shape.style }, shape.serialize().type);
        } else {
          this.onSelectionChange(null, null);
        }
        this.isDrawing = true;
        this.render();
        break;
      case "eraser":
        this.isDrawing = true;
        this.erasedIds = new Set();
        break;
      case "pen":
        this.isDrawing = true;
        this.currentShape = ShapeFactory.create("pen", x, y, this.currentStyle);
        break;
      case "text":
        const screenXText = x * this.zoom + this.panX;
        const screenYText = y * this.zoom + this.panY;
        this.onTextRequest(x, y, screenXText, screenYText);
        break;
      default:
        this.isDrawing = true;
        this.startX = x;
        this.startY = y;
        this.currentShape = ShapeFactory.create(
          this.activeTool,
          x,
          y,
          this.currentStyle,
        );
        break;
    }
  }

  onPointerMove(screenX: number, screenY: number) {
    if (!this.isDrawing) return;
    const { x, y } = this.toCanvasCoords(screenX, screenY);

    switch (this.activeTool) {
      case "hand":
        this.panX += screenX - this.lastRawX;
        this.panY += screenY - this.lastRawY;
        this.lastRawX = screenX;
        this.lastRawY = screenY;
        this.render();
        break;
      case "pointer":
        if (this.isResizing && this.activeHandle && this.selectedShape && this.resizeStartData) {
          const dx = x - this.resizeStartX;
          const dy = y - this.resizeStartY;
          const fresh = ShapeFactory.deserialize(
            JSON.parse(JSON.stringify(this.resizeStartData))
          );
          fresh.resize(this.activeHandle, dx, dy);
          this.shapes.set(fresh.id, fresh);
          this.selectedShape = fresh;
          this.render();
          break;  
        }

        if (!this.selectedShape || !this.originalShapeData) break;
        let dx = x - this.moveStartX;
        let dy = y - this.moveStartY;
        let fresh = ShapeFactory.deserialize(
          JSON.parse(JSON.stringify(this.originalShapeData)),
        );
        fresh.translate(dx, dy);
        this.shapes.set(fresh.id, fresh);
        this.selectedShape = fresh;
        this.render();
        break;
      case "pen":
        if (!this.currentShape) break;
        const pen = this.currentShape as PenShape;
        pen.points.push({ x, y });
        this.render();
        break;
      case "eraser":
        const shape = this.getShape(x, y);
        if (shape && !this.erasedIds.has(shape!.id)) {
          this.shapes.delete(shape.id);
          this.erasedIds.add(shape.id);
          this.render();
        }
        break;
      default:
        if (!this.currentShape) break;
        const width = x - this.startX;
        const height = y - this.startY;
        if (this.activeTool === "rect") {
          const rect = this.currentShape as RectShape;
          rect.width = width;
          rect.height = height;
        } else if (this.activeTool === "circle") {
          const circle = this.currentShape as CircleShape;
          circle.radius = Math.sqrt(width * width + height * height) / 2;
          circle.centerX = this.startX + width / 2;
          circle.centerY = this.startY + height / 2;
        } else if (this.activeTool === "line") {
          const line = this.currentShape as LineShape;
          line.x2 = x;
          line.y2 = y;
        }
        this.render();
        break;
    }
  }

  onPointerUp(screenX: number, screenY: number) {
    if (!this.isDrawing) return;
    const { x, y } = this.toCanvasCoords(screenX, screenY);
    switch (this.activeTool) {
      case "hand":
        this.isDrawing = false;
        break;
      case "pointer":
        if(this.isResizing){
          this.isResizing = false
          this.activeHandle = null
          this.resizeStartData = null
          this.onShapeChange([...this.shapes.values()].map((s) => s.serialize()),)
          break
        }
        this.isDrawing = false;
        this.originalShapeData = null;
        if (this.selectedShape) {
          this.onShapeChange(
            [...this.shapes.values()].map((s) => s.serialize()),
          );
        }
        break;
      case "pen":
        if (!this.currentShape) break;
        const pen = this.currentShape as PenShape;
        pen.points.push({ x, y });
        this.shapes.set(this.currentShape.id, this.currentShape);
        this.onShapeChange([...this.shapes.values()].map((s) => s.serialize()));
        this.currentShape = null;
        this.currentStroke = [];
        this.isDrawing = false;
        break;
      case "eraser":
        this.isDrawing = false;
        if (this.erasedIds.size > 0) {
          this.onErase([...this.erasedIds]);
          this.onShapeChange(
            [...this.shapes.values()].map((s) => s.serialize()),
          );
          this.erasedIds = new Set();
        }
        break;
      case "text":
        this.isDrawing = false;
        break;
      default:
        if (!this.currentShape) break;
        const width = x - this.startX;
        const height = y - this.startY;
        if (this.activeTool === "rect") {
          const rect = this.currentShape as RectShape;
          rect.width = width;
          rect.height = height;
        } else if (this.activeTool === "circle") {
          const circle = this.currentShape as CircleShape;
          circle.radius = Math.sqrt(width * width + height * height) / 2;
          circle.centerX = this.startX + width / 2;
          circle.centerY = this.startY + height / 2;
        } else if (this.activeTool === "line") {
          const line = this.currentShape as LineShape;
          line.x2 = x;
          line.y2 = y;
        }
        this.shapes.set(this.currentShape.id, this.currentShape);
        this.onShapeChange([...this.shapes.values()].map((s) => s.serialize()));
        this.currentShape = null;
        this.isDrawing = false;
        this.render();
        break;
    }
  }

  onRemoteDraw(elements: ShapeData[]): void {
    elements.forEach((data) => {
      const shape = ShapeFactory.deserialize(data);
      this.shapes.set(shape.id, shape);
    });
    this.render();
  }

  onRemoteErase(ids: string[]) {
    ids.forEach((id) => this.shapes.delete(id));
    this.render();
  }

  loadShapes(elements: ShapeData[]): void {
    this.shapes.clear();
    elements.forEach((data) => {
      const shape = ShapeFactory.deserialize(data);
      this.shapes.set(shape.id, shape);
    });
    this.render();
  }

  zoomAt(screenX: number, screenY: number, factor: number) {
    this.panX = screenX - (screenX - this.panX) * factor;
    this.panY = screenY - (screenY - this.panY) * factor;
    this.zoom = Math.min(Math.max(this.zoom * factor, 0.05), 20);
    this.render();
  }

  exportPNG(): void {
    const link = document.createElement("a");
    link.download = "sketch.png";
    link.href = this.canvas.toDataURL("image/png");
    link.click();
  }

  commitText(canvasX: number, canvasY: number, text: string): void {
    if (!text.trim()) return;
    const shape = ShapeFactory.create(
      "text",
      canvasX,
      canvasY,
      this.currentStyle,
    ) as TextShape;
    shape.text = text;
    shape.fontSize = this.currentStyle.fontSize ?? 16;
    this.shapes.set(shape.id, shape);
    this.onShapeChange([...this.shapes.values()].map((s) => s.serialize()));
    this.render();
  }
}
