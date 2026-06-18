import type { ReactNode } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  type SxProps,
  type Theme,
} from "@mui/material";

/** SurePay-style elevated table panel */
export function TableSurface({
  children,
  scroll = false,
  plain = false,
  sx,
}: {
  children: ReactNode;
  scroll?: boolean;
  /** No border/background — use when the inner table carries its own frame. */
  plain?: boolean;
  sx?: SxProps<Theme>;
}) {
  const frameSx: SxProps<Theme> = plain
    ? { bgcolor: "transparent", border: "none", borderRadius: 0 }
    : {
        borderRadius: "6px",
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      };

  if (scroll) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          flex: 1,
          overflow: "hidden",
          ...frameSx,
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        overflowX: "auto",
        ...frameSx,
        ...sx,
      }}
    >
      {children}
    </TableContainer>
  );
}

export function TableScrollBody({ children }: { children: ReactNode }) {
  return <Box sx={{ minHeight: 0, flex: 1, overflow: "auto" }}>{children}</Box>;
}

/**
 * Single-table scroll region: sticky thead, tbody rows scroll beneath it.
 * One table guarantees header/body columns share the same layout (colgroup widths).
 */
export function SplitScrollTable({
  columns,
  header,
  children,
  minWidth = 640,
  "aria-label": ariaLabel,
  bodyMinHeight = 160,
}: {
  /** Pixel or % widths — must match the number of data columns. */
  columns?: (number | string)[];
  header: ReactNode;
  children: ReactNode;
  minWidth?: number;
  "aria-label": string;
  /** Keeps empty/loading states from collapsing the scroll region. */
  bodyMinHeight?: number;
}) {
  const colGroup =
    columns && columns.length > 0 ? (
      <colgroup>
        {columns.map((width, index) => {
          const px = typeof width === "number" ? `${width}px` : width;
          return (
            <col
              key={index}
              style={{
                width: px,
                minWidth: typeof width === "number" ? `${width}px` : undefined,
              }}
            />
          );
        })}
      </colgroup>
    ) : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: bodyMinHeight,
          border: 1,
          borderColor: "divider",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <Box
          role="region"
          aria-label={`${ariaLabel} rows`}
          tabIndex={0}
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarGutter: "stable",
          }}
        >
          <Table
            size="small"
            sx={{
              minWidth,
              width: columns?.length ? minWidth : "100%",
              tableLayout: "fixed",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
            aria-label={ariaLabel}
          >
            {colGroup}
            {header}
            {children}
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

const headCellSx: SxProps<Theme> = {
  px: 1.5,
  py: 1.25,
  fontWeight: 600,
  fontSize: "0.8125rem",
  color: "text.secondary",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  borderBottom: 1,
  borderColor: "divider",
  bgcolor: "background.default",
  boxSizing: "border-box",
};

/** Solid hover fill — avoids see-through sticky columns over scrolled cells. */
const bodyRowHoverBg = "background.default";

const bodyCellSx: SxProps<Theme> = {
  px: 1.5,
  py: 0.75,
  fontSize: "0.8125rem",
  borderBottom: 1,
  borderColor: "divider",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  maxWidth: 0,
  bgcolor: "background.paper",
  ".MuiTableRow-root:hover &": { bgcolor: bodyRowHoverBg },
  ".MuiTableRow-root.Mui-selected &": { bgcolor: "primary.light" },
  ".MuiTableRow-root.Mui-selected:hover &": { bgcolor: "primary.light" },
};

const stickyBodyCellStateSx: SxProps<Theme> = {
  bgcolor: "background.paper",
  backgroundClip: "padding-box",
  ".MuiTableRow-root:hover &": { bgcolor: bodyRowHoverBg },
  ".MuiTableRow-root.Mui-selected &": { bgcolor: "primary.light" },
  ".MuiTableRow-root.Mui-selected:hover &": { bgcolor: "primary.light" },
};

function stickyLeftCellSx(isHead: boolean, left: number): SxProps<Theme> {
  const zIndex = isHead ? (left === 0 ? 12 : 11) : left === 0 ? 3 : 2;

  return {
    position: "sticky",
    left,
    ...(isHead && { top: 0 }),
    zIndex,
    ...(isHead
      ? { bgcolor: "background.default", backgroundClip: "padding-box" }
      : stickyBodyCellStateSx),
    boxShadow: (theme) => {
      const edge = `1px 0 0 0 ${theme.palette.divider}`;
      return isHead ? `${edge}, 0 1px 0 0 ${theme.palette.divider}` : edge;
    },
  };
}

export function AppTable({
  children,
  minWidth = 640,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  minWidth?: number;
  "aria-label"?: string;
}) {
  return (
    <Table size="small" sx={{ minWidth }} aria-label={ariaLabel}>
      {children}
    </Table>
  );
}

export function AppTableHead({
  children,
  sticky = false,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <TableHead
      sx={
        sticky
          ? {
              "& .MuiTableCell-head": {
                position: "sticky",
                top: 0,
                zIndex: 10,
                bgcolor: "background.default",
                boxShadow: (theme) => `0 1px 0 0 ${theme.palette.divider}`,
              },
              "& .MuiTableCell-head[data-sticky-left]": {
                zIndex: 11,
              },
              "& .MuiTableCell-head[data-sticky-left='0']": {
                zIndex: 12,
              },
            }
          : undefined
      }
    >
      {children}
    </TableHead>
  );
}

export function AppTableHeadCell({
  children,
  align = "left",
  minWidth,
  stickyLeftOffset,
  sx,
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  /** @deprecated Use SplitScrollTable `columns` / colgroup for width control. */
  width?: number | string;
  minWidth?: number;
  /** Pin column while scrolling horizontally — value is the `left` offset in px. */
  stickyLeftOffset?: number;
  sx?: SxProps<Theme>;
}) {
  return (
    <TableCell
      align={align}
      {...(stickyLeftOffset !== undefined
        ? { "data-sticky-left": String(stickyLeftOffset) }
        : {})}
      sx={[
        headCellSx,
        minWidth !== undefined && { minWidth },
        stickyLeftOffset !== undefined &&
          stickyLeftCellSx(true, stickyLeftOffset),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </TableCell>
  );
}

export function AppTableBody({ children }: { children: ReactNode }) {
  return <TableBody>{children}</TableBody>;
}

export function AppTableRow({
  children,
  selected = false,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <TableRow
      selected={selected}
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        "&:last-child td": { borderBottom: 0 },
      }}
    >
      {children}
    </TableRow>
  );
}

export function AppTableCell({
  children,
  align = "left",
  colSpan,
  muted = false,
  nowrap = true,
  title,
  minWidth,
  stickyLeftOffset,
  sx,
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  colSpan?: number;
  muted?: boolean;
  /** When false, cell text may wrap (e.g. empty-state row). */
  nowrap?: boolean;
  title?: string;
  minWidth?: number;
  /** Pin column while scrolling horizontally — value is the `left` offset in px. */
  stickyLeftOffset?: number;
  sx?: SxProps<Theme>;
}) {
  return (
    <TableCell
      align={align}
      colSpan={colSpan}
      title={title}
      sx={[
        bodyCellSx,
        muted && { color: "text.secondary" },
        !nowrap && { whiteSpace: "normal", maxWidth: "none" },
        minWidth !== undefined && { minWidth },
        stickyLeftOffset !== undefined &&
          stickyLeftCellSx(false, stickyLeftOffset),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </TableCell>
  );
}

export function AppTableEmptyRow({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  return (
    <TableRow>
      <AppTableCell
        colSpan={colSpan}
        muted
        nowrap={false}
        sx={{ py: 4, textAlign: "center", maxWidth: "none" }}
      >
        {message}
      </AppTableCell>
    </TableRow>
  );
}

/** Placeholder rows to preserve table height while data loads. */
export function AppTableLoadingRows({
  colSpan,
  rows = 6,
}: {
  colSpan: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <TableRow key={`loading-${index}`} aria-hidden="true">
          <AppTableCell colSpan={colSpan} sx={{ py: 0.75, maxWidth: "none" }}>
            <Box
              sx={{
                height: 16,
                borderRadius: 1,
                bgcolor: "action.hover",
                opacity: 0.55,
                animation: "pulse 1.4s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 0.45 },
                  "50%": { opacity: 0.75 },
                },
              }}
            />
          </AppTableCell>
        </TableRow>
      ))}
    </>
  );
}
