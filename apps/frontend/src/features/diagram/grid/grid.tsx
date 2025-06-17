import { useLayoutEffect, useRef } from "react";
import {
  approximately,
  TLGridProps,
  useEditor,
  //   useIsDarkMode,
  useValue,
} from "tldraw";

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.stroke();
}

function getColorFromCSSVariable(variableName: `--${string}`) {
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(variableName).trim();
}

export function Grid({ size, ...camera }: TLGridProps) {
  const editor = useEditor();
  const screenBounds = useValue(
    "screenBounds",
    () => editor.getViewportScreenBounds(),
    []
  );
  const devicePixelRatio = useValue(
    "dpr",
    () => editor.getInstanceState().devicePixelRatio,
    []
  );
  const isReadOnlyMode = useValue(
    "isReadonly",
    () => editor.getIsReadonly(),
    []
  );

  //   const isDarkMode = useIsDarkMode();

  const canvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (!canvas.current) return;
    const canvasW = screenBounds.w * devicePixelRatio;
    const canvasH = screenBounds.h * devicePixelRatio;
    canvas.current.width = canvasW;
    canvas.current.height = canvasH;

    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    if (isReadOnlyMode) return;

    ctx.clearRect(0, 0, canvasW, canvasH);

    const pageViewportBounds = editor.getViewportPageBounds();

    const startPageX = Math.ceil(pageViewportBounds.minX / size) * size;
    const startPageY = Math.ceil(pageViewportBounds.minY / size) * size;
    const endPageX = Math.floor(pageViewportBounds.maxX / size) * size;
    const endPageY = Math.floor(pageViewportBounds.maxY / size) * size;
    const numRows = Math.round((endPageY - startPageY) / size);
    const numCols = Math.round((endPageX - startPageX) / size);

    ctx.strokeStyle = getColorFromCSSVariable("--xy-background-stroke-color");

    for (let row = 0; row <= numRows; row++) {
      const pageY = startPageY + row * size;
      const canvasY = (pageY + camera.y) * camera.z * devicePixelRatio;
      const isMajorLine = approximately(pageY % (size * 10), 0);
      drawLine(ctx, 0, canvasY, canvasW, canvasY, isMajorLine ? 1 : 0.5);
    }
    for (let col = 0; col <= numCols; col++) {
      const pageX = startPageX + col * size;
      const canvasX = (pageX + camera.x) * camera.z * devicePixelRatio;
      const isMajorLine = approximately(pageX % (size * 10), 0);
      drawLine(ctx, canvasX, 0, canvasX, canvasH, isMajorLine ? 1 : 0.5);
    }
  }, [
    screenBounds,
    camera,
    size,
    devicePixelRatio,
    editor,
    // isDarkMode,
    isReadOnlyMode,
  ]);

  return <canvas className="tl-grid" ref={canvas} />;
}
