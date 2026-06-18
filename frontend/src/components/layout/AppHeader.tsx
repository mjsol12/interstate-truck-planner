import { Link as RouterLink } from "react-router-dom";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ThemeToggleButton from "./ThemeToggleButton";
import { useSidebar } from "../../context/SidebarContext";
import { tokens } from "../../theme/tokens";

export default function AppHeader() {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        minHeight: tokens.layout.headerHeight,
        px: { xs: 2, lg: 3 },
        py: { xs: 1.5, lg: 2 },
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Tooltip title="Toggle sidebar">
          <IconButton
            onClick={handleToggle}
            aria-label="Toggle sidebar"
            sx={{
              width: 44,
              height: 44,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            {isMobileOpen ? <CloseIcon /> : <MenuOpenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            display: { xs: "block", lg: "none" },
            fontWeight: 700,
            color: "text.primary",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          ELD Planner
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ThemeToggleButton />
      </Box>
    </Box>
  );
}
