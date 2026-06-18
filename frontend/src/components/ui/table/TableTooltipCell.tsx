import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { tokens } from "../../../theme/tokens";

const CLOSE_DELAY_MS = 160;

function firstLine(text: string): string {
  return text.split(/\r?\n/)[0]?.trim() ?? "";
}

function toMessageLines(text: string, listStyle: boolean): string[] {
  if (listStyle && text.includes(";")) {
    return text.split(/;\s*/).filter(Boolean);
  }
  return text.split(/\r?\n/).filter((line) => line.trim().length > 0);
}

function MessageQuoteCard({
  label,
  text,
  listStyle = false,
}: {
  label: string;
  text: string;
  listStyle?: boolean;
}) {
  const titleId = useId();
  const lines = toMessageLines(text, listStyle);
  const body = lines.length > 0 ? lines : [text];

  return (
    <Box
      role="dialog"
      aria-labelledby={titleId}
      sx={{
        width: { xs: 280, sm: 340 },
        p: 1.5,
        bgcolor: "background.default",
        borderRadius: `${tokens.radius.md}px`,
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.25, alignItems: "flex-start" }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            fontSize: "0.875rem",
          }}
        >
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 17 }} />
        </Avatar>
        <Box sx={{ minWidth: 0, pt: 0.125 }}>
          <Typography
            id={titleId}
            variant="subtitle2"
            component="p"
            sx={{ fontWeight: 600, lineHeight: 1.3 }}
          >
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Driver daily log
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          position: "relative",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderLeftWidth: 3,
          borderLeftColor: "primary.main",
          borderRadius: "16px 16px 16px 6px",
          px: 1.75,
          py: 1.25,
          boxShadow: tokens.shadow.sm,
        }}
      >
        <FormatQuoteRoundedIcon
          aria-hidden
          sx={{
            position: "absolute",
            top: 8,
            right: 10,
            fontSize: 18,
            color: "primary.main",
            opacity: 0.2,
          }}
        />

        {listStyle && body.length > 1 ? (
          <Stack component="ul" spacing={0.75} sx={{ m: 0, pl: 2.25, pr: 2 }}>
            {body.map((line) => (
              <Typography
                key={line}
                component="li"
                variant="body2"
                sx={{ lineHeight: 1.55, color: "text.primary" }}
              >
                {line}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography
            component="p"
            variant="body2"
            sx={{
              m: 0,
              pr: 2,
              color: "text.primary",
              whiteSpace: "pre-wrap",
              lineHeight: 1.55,
            }}
          >
            {text}
          </Typography>
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1, textAlign: "right" }}
      >
        {body.length > 1 ? `${body.length} entries` : "Quoted note"}
      </Typography>
    </Box>
  );
}

interface TableTooltipCellContentProps {
  text: string;
  emptyPlaceholder?: string;
  label?: string;
  /** Split text into a bulleted message list (e.g. activities). */
  listStyle?: boolean;
}

function TableTooltipCellContent({
  text,
  emptyPlaceholder = "—",
  label = "Note",
  listStyle = false,
}: TableTooltipCellContentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trimmed = text.trim();
  const open = Boolean(anchorEl);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setAnchorEl(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  const handleOpen = useCallback(
    (element: HTMLElement) => {
      cancelClose();
      setAnchorEl(element);
    },
    [cancelClose],
  );

  if (!trimmed) {
    return <>{emptyPlaceholder}</>;
  }

  const display = firstLine(trimmed);

  return (
    <>
      <Box
        component="span"
        onMouseEnter={(event) => handleOpen(event.currentTarget)}
        onMouseLeave={scheduleClose}
        onFocus={(event) => handleOpen(event.currentTarget)}
        onBlur={scheduleClose}
        tabIndex={0}
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          borderLeft: 2,
          borderColor: "divider",
          pl: 1,
          ml: -0.25,
          outline: "none",
          "&:focus-visible": {
            borderColor: "primary.main",
            borderRadius: `${tokens.radius.xs}px`,
          },
        }}
      >
        {display}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        disableRestoreFocus
        slotProps={{
          paper: {
            onMouseEnter: cancelClose,
            onMouseLeave: scheduleClose,
            elevation: 4,
            sx: {
              mt: -0.75,
              pointerEvents: "auto",
              overflow: "hidden",
              borderRadius: `${tokens.radius.md}px`,
              border: 1,
              borderColor: "divider",
            },
          },
        }}
        sx={{ pointerEvents: "none" }}
      >
        <MessageQuoteCard label={label} text={trimmed} listStyle={listStyle} />
      </Popover>
    </>
  );
}

export default memo(TableTooltipCellContent);
export { TableTooltipCellContent };

/** Column header label with quote icon — indicates hoverable quote preview. */
export function QuoteColumnHeader({ label }: { label: string }) {
  return (
    <Box
      component="span"
      title="Hover a cell to view the full quote"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
    >
      <FormatQuoteRoundedIcon
        aria-hidden
        sx={{ fontSize: 15, color: "primary.main", opacity: 0.85 }}
      />
      {label}
    </Box>
  );
}
