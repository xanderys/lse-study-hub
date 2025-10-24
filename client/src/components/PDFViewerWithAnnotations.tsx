import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export type AnnotationData = {
  type: "highlight" | "pen";
  pageNumber: number;
  color: string;
  paths?: { x: number; y: number }[][]; // For pen tool
  rects?: { x: number; y: number; width: number; height: number }[]; // For highlight tool
};

type PDFViewerWithAnnotationsProps = {
  pdfUrl: string | null;
  currentPage: number;
  scale: number;
  activeTool: "none" | "highlight" | "pen";
  annotations: AnnotationData[];
  onAnnotationCreate: (annotation: Omit<AnnotationData, "pageNumber"> & { pageNumber: number }) => void;
  onPageChange: (page: number) => void;
  onScaleChange: (scale: number) => void;
};

export default function PDFViewerWithAnnotations({
  pdfUrl,
  currentPage,
  scale,
  activeTool,
  annotations,
  onAnnotationCreate,
  onPageChange,
  onScaleChange,
}: PDFViewerWithAnnotationsProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPaths, setCurrentPaths] = useState<{ x: number; y: number }[][]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [highlightStart, setHighlightStart] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Filter annotations for current page
  const pageAnnotations = annotations.filter(a => a.pageNumber === currentPage);

  // Redraw annotations whenever they change
  useEffect(() => {
    if (!canvasRef.current || !pageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match PDF page
    const pageElement = pageRef.current.querySelector(".react-pdf__Page__canvas") as HTMLCanvasElement;
    if (pageElement) {
      canvas.width = pageElement.width;
      canvas.height = pageElement.height;
      canvas.style.width = `${pageElement.style.width}`;
      canvas.style.height = `${pageElement.style.height}`;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw saved annotations
    pageAnnotations.forEach(annotation => {
      if (annotation.type === "pen" && annotation.paths) {
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = 2 * scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        annotation.paths.forEach(path => {
          if (path.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(path[0].x * scale, path[0].y * scale);
          path.slice(1).forEach(point => {
            ctx.lineTo(point.x * scale, point.y * scale);
          });
          ctx.stroke();
        });
      } else if (annotation.type === "highlight" && annotation.rects) {
        ctx.fillStyle = annotation.color;
        ctx.globalAlpha = 0.3;
        annotation.rects.forEach(rect => {
          ctx.fillRect(
            rect.x * scale,
            rect.y * scale,
            rect.width * scale,
            rect.height * scale
          );
        });
        ctx.globalAlpha = 1.0;
      }
    });

    // Draw current drawing
    if (activeTool === "pen" && currentPaths.length > 0) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2 * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      currentPaths.forEach(path => {
        if (path.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(path[0].x * scale, path[0].y * scale);
        path.slice(1).forEach(point => {
          ctx.lineTo(point.x * scale, point.y * scale);
        });
        ctx.stroke();
      });
    }

    // Draw current path
    if (activeTool === "pen" && currentPath.length > 0) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2 * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x * scale, currentPath[0].y * scale);
      currentPath.slice(1).forEach(point => {
        ctx.lineTo(point.x * scale, point.y * scale);
      });
      ctx.stroke();
    }
  }, [pageAnnotations, currentPaths, currentPath, activeTool, scale, currentPage]);

  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      };
    },
    [scale]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (activeTool === "none") return;
      
      setIsDrawing(true);
      const coords = getCanvasCoordinates(e);

      if (activeTool === "pen") {
        setCurrentPath([coords]);
      } else if (activeTool === "highlight") {
        setHighlightStart(coords);
      }
    },
    [activeTool, getCanvasCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const coords = getCanvasCoordinates(e);

      if (activeTool === "pen") {
        setCurrentPath(prev => [...prev, coords]);
      } else if (activeTool === "highlight" && highlightStart) {
        // Show highlight preview
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) {
          // Redraw to clear previous preview
          const event = new CustomEvent("redraw");
          canvas.dispatchEvent(event);
          
          // Draw highlight preview
          ctx.fillStyle = "#ffff00";
          ctx.globalAlpha = 0.3;
          ctx.fillRect(
            highlightStart.x * scale,
            highlightStart.y * scale,
            (coords.x - highlightStart.x) * scale,
            (coords.y - highlightStart.y) * scale
          );
          ctx.globalAlpha = 1.0;
        }
      }
    },
    [isDrawing, activeTool, highlightStart, getCanvasCoordinates, scale]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      setIsDrawing(false);

      const coords = getCanvasCoordinates(e);

      if (activeTool === "pen" && currentPath.length > 0) {
        // Save pen annotation
        const newPaths = [...currentPaths, currentPath];
        setCurrentPaths(newPaths);
        setCurrentPath([]);
        
        onAnnotationCreate({
          type: "pen",
          pageNumber: currentPage,
          color: "#3b82f6",
          paths: newPaths,
        });
      } else if (activeTool === "highlight" && highlightStart) {
        // Save highlight annotation
        const rect = {
          x: Math.min(highlightStart.x, coords.x),
          y: Math.min(highlightStart.y, coords.y),
          width: Math.abs(coords.x - highlightStart.x),
          height: Math.abs(coords.y - highlightStart.y),
        };

        if (rect.width > 5 && rect.height > 5) {
          onAnnotationCreate({
            type: "highlight",
            pageNumber: currentPage,
            color: "#ffff00",
            rects: [rect],
          });
        }

        setHighlightStart(null);
      }
    },
    [
      isDrawing,
      activeTool,
      currentPath,
      currentPaths,
      highlightStart,
      currentPage,
      getCanvasCoordinates,
      onAnnotationCreate,
    ]
  );

  // Reset drawing state when tool or page changes
  useEffect(() => {
    setCurrentPath([]);
    setCurrentPaths([]);
    setHighlightStart(null);
    setIsDrawing(false);
  }, [activeTool, currentPage]);

  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="flex-1 overflow-auto p-4" ref={containerRef}>
      <div className="max-w-4xl mx-auto relative" ref={pageRef}>
        <div className="relative">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={false}
            />
          </Document>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-auto"
            style={{
              cursor:
                activeTool === "pen"
                  ? "crosshair"
                  : activeTool === "highlight"
                  ? "text"
                  : "default",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
          />
        </div>
      </div>

      {/* PDF Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 flex items-center justify-center gap-8 z-10">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm min-w-[120px] text-center">
            Page {currentPage} of {numPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
            disabled={currentPage >= numPages}
          >
            Next
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
          >
            -
          </Button>
          <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}

