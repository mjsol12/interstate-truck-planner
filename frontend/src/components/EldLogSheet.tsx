import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import type { LogSheet } from "../types/trip";
import { tokens } from "../theme/tokens";

const ROWS = [
  { key: "off_duty", label: "Off Duty", color: tokens.colors.textSecondary },
  { key: "sleeper", label: "Sleeper Berth", color: "#78716c" },
  { key: "driving", label: "Driving", color: tokens.colors.primary },
  {
    key: "on_duty",
    label: "On Duty (Not Driving)",
    color: tokens.colors.warning,
  },
] as const;

const GRID = {
  left: 130,
  top: 120,
  width: 620,
  height: 160,
  rowHeight: 40,
};

interface EldLogSheetProps {
  sheet: LogSheet;
}

export default function EldLogSheet({ sheet }: EldLogSheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelId = `log-sheet-${sheet.day_number}-title`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 520 * dpr;
    canvas.style.width = "100%";
    canvas.style.maxWidth = "800px";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "800 / 520";
    ctx.scale(dpr, dpr);

    ctx.fillStyle = tokens.colors.surface;
    ctx.fillRect(0, 0, 800, 520);

    ctx.strokeStyle = tokens.colors.text;
    ctx.lineWidth = 1;
    ctx.fillStyle = tokens.colors.text;
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

    drawGrid(ctx);

    for (const segment of sheet.segments) {
      drawSegment(ctx, segment.status, segment.start, segment.end);
    }

    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillStyle = tokens.colors.textSecondary;
    ctx.fillText(`Remarks: ${truncate(sheet.remarks, 90)}`, 20, 490);
  }, [sheet]);

  return (
    <Box
      component="article"
      aria-labelledby={labelId}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" component="h3" id={labelId} gutterBottom>
        Day {sheet.day_number} — {sheet.date_display}
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "center", overflowX: "auto" }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`FMCSA daily log for day ${sheet.day_number}, ${sheet.date_display}. ${sheet.segments.length} duty status segments.`}
          style={{
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: 8,
          }}
        />
      </Box>
    </Box>
  );
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = tokens.colors.borderStrong;
  ctx.lineWidth = 1;

  for (let h = 0; h <= 24; h++) {
    const x = GRID.left + (h / 24) * GRID.width;
    ctx.beginPath();
    ctx.moveTo(x, GRID.top);
    ctx.lineTo(x, GRID.top + GRID.height);
    ctx.stroke();

    if (h % 2 === 0) {
      ctx.fillStyle = tokens.colors.textMuted;
      ctx.font = "9px Inter, system-ui, sans-serif";
      const label = h === 0 ? "Mid" : h === 12 ? "Noon" : String(h);
      ctx.fillText(label, x - 8, GRID.top - 6);
    }
  }

  ROWS.forEach((row, i) => {
    const y = GRID.top + i * GRID.rowHeight;
    ctx.fillStyle = tokens.colors.text;
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.fillText(row.label, 10, y + GRID.rowHeight / 2 + 4);

    ctx.strokeStyle = tokens.colors.border;
    ctx.beginPath();
    ctx.moveTo(GRID.left, y);
    ctx.lineTo(GRID.left + GRID.width, y);
    ctx.stroke();
  });

  ctx.strokeStyle = tokens.colors.text;
  ctx.lineWidth = 2;
  ctx.strokeRect(GRID.left, GRID.top, GRID.width, GRID.height);
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  status: string,
  start: number,
  end: number,
) {
  const rowIndex = ROWS.findIndex((r) => r.key === status);
  if (rowIndex < 0) return;

  const row = ROWS[rowIndex];
  const y = GRID.top + rowIndex * GRID.rowHeight + GRID.rowHeight / 2;
  const x1 = GRID.left + (start / 24) * GRID.width;
  const x2 = GRID.left + (end / 24) * GRID.width;

  ctx.strokeStyle = row.color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(Math.max(x2, x1 + 2), y);
  ctx.stroke();
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
