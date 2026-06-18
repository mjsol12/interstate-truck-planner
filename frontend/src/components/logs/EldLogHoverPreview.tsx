import { memo, useCallback, useEffect, useRef, useState } from "react";
import { IconButton, Popover } from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import EldLogSheetGraph from "../eld/EldLogSheetGraph";
import type { LogSheet } from "../../types/trip";
import { tokens } from "../../theme/tokens";

const CLOSE_DELAY_MS = 180;

interface EldLogHoverPreviewProps {
  sheet: LogSheet;
}

function EldLogHoverPreview({ sheet }: EldLogHoverPreviewProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Preview ELD log for day ${sheet.day_number}`}
        aria-expanded={open}
        onMouseEnter={(event) => handleOpen(event.currentTarget)}
        onMouseLeave={scheduleClose}
        onFocus={(event) => handleOpen(event.currentTarget)}
        onBlur={scheduleClose}
        onClick={(event) => event.stopPropagation()}
        sx={{
          color: "text.secondary",
          borderRadius: `${tokens.radius.xs}px`,
          "&:hover": {
            color: "primary.main",
            bgcolor: "primary.light",
          },
        }}
      >
        <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        disableRestoreFocus
        slotProps={{
          paper: {
            "aria-label": `ELD graph preview for day ${sheet.day_number}`,
            onMouseEnter: cancelClose,
            onMouseLeave: scheduleClose,
            sx: {
              p: 0.75,
              width: { xs: 280, sm: 360 },
              maxWidth: "calc(100vw - 32px)",
              pointerEvents: "auto",
              borderRadius: `${tokens.radius.sm}px`,
              border: 1,
              borderColor: "divider",
              boxShadow: 3,
              overflow: "hidden",
            },
          },
        }}
        sx={{ pointerEvents: "none" }}
      >
        <EldLogSheetGraph
          sheet={sheet}
          maxWidth={340}
          graphOnly
          showBorder={false}
        />
      </Popover>
    </>
  );
}

export default memo(EldLogHoverPreview);
