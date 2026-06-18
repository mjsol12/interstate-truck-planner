import { useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import type { LogSheet } from "../../types/trip";
import { tokens } from "../../theme/tokens";

interface GraphColors {
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  primary: string;
  warning: string;
}

const ROW_KEYS = [
  { key: "off_duty", label: "Off Duty", colorKey: "textSecondary" as const },
  { key: "sleeper", label: "Sleeper Berth", colorKey: "textMuted" as const },
  { key: "driving", label: "Driving", colorKey: "primary" as const },
  { key: "on_duty", label: "On Duty (Not Driving)", colorKey: "warning" as const },
] as const;

const FULL_GRID = {
  left: 130,
  top: 120,
  width: 620,
  height: 160,
  rowHeight: 40,
};

const GRAPH_ONLY_PADDING = 8;

interface GridLayout {
  left: number;
  top: number;
  width: number;
  height: number;
  rowHeight: number;
}

interface EldLogSheetGraphProps {
  sheet: LogSheet;
  maxWidth?: number | string;
  showBorder?: boolean;
  /** Grid lines and duty segments only — no labels or header text. */
  graphOnly?: boolean;
}

function resolveGraphColors(isDark: boolean): GraphColors {
  const d = tokens.dark;
  const c = tokens.colors;

  return {
    surface: isDark ? d.surface : c.surface,
    text: isDark ? d.text : c.text,
    textSecondary: isDark ? d.textSecondary : c.textSecondary,
    textMuted: isDark ? d.textMuted : c.textMuted,
    border: isDark ? d.border : c.border,
    borderStrong: isDark ? d.borderStrong : c.borderStrong,
    primary: c.primary,
    warning: c.warning,
  };
}

function rowColor(
  colors: GraphColors,
  colorKey: (typeof ROW_KEYS)[number]["colorKey"],
) {
  return colors[colorKey];
}

export default function EldLogSheetGraph({
  sheet,
  maxWidth = 800,
  showBorder = true,
  graphOnly = false,
}: EldLogSheetGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? tokens.dark.border : tokens.colors.border;

  useEffect(() => {
    const colors = resolveGraphColors(isDark);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const grid = getGridLayout(graphOnly);
    const canvasWidth = graphOnly
      ? grid.width + GRAPH_ONLY_PADDING * 2
      : 800;
    const canvasHeight = graphOnly
      ? grid.height + GRAPH_ONLY_PADDING * 2
      : 520;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = "100%";
    canvas.style.maxWidth =
      typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
    canvas.style.height = "auto";
    canvas.style.aspectRatio = `${canvasWidth} / ${canvasHeight}`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = colors.surface;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (!graphOnly) {
      ctx.strokeStyle = colors.text;
      ctx.lineWidth = 1;
      ctx.fillStyle = colors.text;
      ctx.font = "bold 13px Inter, system-ui, sans-serif";
      ctx.fillText(
        "U.S. DEPARTMENT OF TRANSPORTATION — DRIVER'S DAILY LOG",
        20,
        28,
      );
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.fillText(
        `Day ${sheet.day_number} — Date: ${sheet.date_display}`,
        20,
        50,
      );
      ctx.fillText(`From: ${truncate(sheet.from_location, 55)}`, 20, 68);
      ctx.fillText(`To: ${truncate(sheet.to_location, 55)}`, 20, 86);
      ctx.fillText(`Total Miles: ${sheet.total_miles}`, 520, 50);
      ctx.fillText("24-Hour Period (Midnight to Midnight)", 20, 108);
    }

    drawGrid(ctx, grid, !graphOnly, colors);
    drawDutyTimeline(ctx, grid, sheet.segments, colors);

    if (!graphOnly) {
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.fillStyle = colors.textSecondary;
      ctx.fillText(`Remarks: ${truncate(sheet.remarks, 90)}`, 20, 490);
    }
  }, [sheet, maxWidth, graphOnly, isDark]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", overflowX: "auto" }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={
          graphOnly
            ? `ELD duty status graph for day ${sheet.day_number}`
            : `FMCSA daily log for day ${sheet.day_number}, ${sheet.date_display}. ${sheet.segments.length} duty status segments.`
        }
        style={{
          border: showBorder ? `1px solid ${borderColor}` : "none",
          borderRadius: showBorder ? 8 : 0,
          display: "block",
        }}
      />
    </Box>
  );
}

function getGridLayout(graphOnly: boolean): GridLayout {
  if (graphOnly) {
    return {
      left: GRAPH_ONLY_PADDING,
      top: GRAPH_ONLY_PADDING,
      width: FULL_GRID.width,
      height: FULL_GRID.height,
      rowHeight: FULL_GRID.rowHeight,
    };
  }
  return FULL_GRID;
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: GridLayout,
  showLabels: boolean,
  colors: GraphColors,
) {
  ctx.strokeStyle = colors.borderStrong;
  ctx.lineWidth = 1;

  for (let h = 0; h <= 24; h++) {
    const x = grid.left + (h / 24) * grid.width;
    ctx.beginPath();
    ctx.moveTo(x, grid.top);
    ctx.lineTo(x, grid.top + grid.height);
    ctx.stroke();

    if (showLabels && h % 2 === 0) {
      ctx.fillStyle = colors.textMuted;
      ctx.font = "9px Inter, system-ui, sans-serif";
      const label = h === 0 ? "Mid" : h === 12 ? "Noon" : String(h);
      ctx.fillText(label, x - 8, grid.top - 6);
    }
  }

  ROW_KEYS.forEach((row, i) => {
    const y = grid.top + i * grid.rowHeight;

    if (showLabels) {
      ctx.fillStyle = colors.text;
      ctx.font = "10px Inter, system-ui, sans-serif";
      ctx.fillText(row.label, 10, y + grid.rowHeight / 2 + 4);
    }

    ctx.strokeStyle = colors.border;
    ctx.beginPath();
    ctx.moveTo(grid.left, y);
    ctx.lineTo(grid.left + grid.width, y);
    ctx.stroke();
  });

  ctx.strokeStyle = colors.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(grid.left, grid.top, grid.width, grid.height);
}

function rowCenterY(grid: GridLayout, rowIndex: number): number {
  return grid.top + rowIndex * grid.rowHeight + grid.rowHeight / 2;
}

function timeX(grid: GridLayout, hour: number): number {
  return grid.left + (hour / 24) * grid.width;
}

function drawDutyTimeline(
  ctx: CanvasRenderingContext2D,
  grid: GridLayout,
  segments: LogSheet["segments"],
  colors: GraphColors,
) {
  segments.forEach((segment, index) => {
    const rowIndex = ROW_KEYS.findIndex((r) => r.key === segment.status);
    if (rowIndex < 0) return;

    const row = ROW_KEYS[rowIndex];
    const y = rowCenterY(grid, rowIndex);
    const xStart = timeX(grid, segment.start);
    const xEnd = timeX(grid, segment.end);

    ctx.strokeStyle = rowColor(colors, row.colorKey);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(xStart, y);
    ctx.lineTo(Math.max(xEnd, xStart + 2), y);

    const next = segments[index + 1];
    if (next) {
      const nextRow = ROW_KEYS.findIndex((r) => r.key === next.status);
      if (nextRow >= 0 && nextRow !== rowIndex) {
        ctx.lineTo(timeX(grid, segment.end), rowCenterY(grid, nextRow));
      }
    }

    ctx.stroke();
  });
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
