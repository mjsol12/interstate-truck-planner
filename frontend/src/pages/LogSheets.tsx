import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useMemo, useState } from "react";
import LogSheetsTable from "../components/logs/LogSheetsTable";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import SearchInput from "../components/ui/SearchInput";
import TablePagination from "../components/ui/table/TablePagination";
import { useClientPagination } from "../hooks/useClientPagination";
import { listTrips } from "../api/trips";
import type { TripResponse } from "../types/trip";
import {
  filterLogSheetRows,
  flattenLogSheets,
  type LogSheetListFilters,
} from "../types/logSheetList";

const PAGE_SIZE = 100;

const defaultFilters: LogSheetListFilters = {
  search: "",
  tripId: "all",
};

/**
 * Log Sheets list page — locked to the viewport (no page scroll).
 * Flex column: header + filters (fixed) → table (flex-1, body scrolls) → pagination (fixed).
 */
export default function LogSheets() {
  const [tripsWithLogs, setTripsWithLogs] = useState<TripResponse[]>([]);
  const [filters, setFilters] = useState<LogSheetListFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const allTrips = await listTrips();
      const withLogs = allTrips.filter(
        (t) =>
          t.status === "completed" &&
          (t.route_data?.log_sheets?.length ?? 0) > 0,
      );
      setTripsWithLogs(withLogs);
    } catch {
      setError("Could not load log sheets. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const allRows = useMemo(
    () => flattenLogSheets(tripsWithLogs),
    [tripsWithLogs],
  );
  const filteredRows = useMemo(
    () => filterLogSheetRows(allRows, filters),
    [allRows, filters],
  );

  const pagination = useClientPagination(filteredRows, { pageSize: PAGE_SIZE });

  useEffect(() => {
    pagination.resetPage();
  }, [filters.search, filters.tripId, pagination.resetPage]);

  const hasActiveFilters =
    filters.search.trim() !== "" || filters.tripId !== "all";
  const clearFilters = () => setFilters(defaultFilters);
  const showDataPanel = !error && (loading || allRows.length > 0);

  return (
    <Box
      component="section"
      aria-labelledby="log-sheets-title"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Fixed page header */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
          flexShrink: 0,
          pb: 1.5,
        }}
      >
        <PageHeader
          id="log-sheets-title"
          title="ELD log sheets"
          description="Browse daily driver logs — filter the list, then open a row for the full FMCSA grid."
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={load}
          disabled={loading}
          sx={{ alignSelf: "flex-start" }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={load}>
              Retry
            </Button>
          }
          sx={{ flexShrink: 0, mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {!error && !loading && allRows.length === 0 && (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EmptyState
            icon={<DescriptionOutlinedIcon />}
            title="No log sheets yet"
            description="Plan a trip first to auto-generate daily FMCSA driver log sheets."
            action={{ label: "Go to Planner", href: "/planner" }}
          />
        </Box>
      )}

      {showDataPanel && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Fixed filters */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
              pb: 2,
            }}
          >
            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "1 1 280px" },
                minWidth: 0,
                maxWidth: { sm: 360 },
              }}
            >
              <SearchInput
                value={filters.search}
                onChange={(search) =>
                  setFilters((prev) => ({ ...prev, search }))
                }
                placeholder="Search trip, route, location, date…"
                aria-label="Search log sheets"
              />
            </Box>
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            >
              <InputLabel id="log-trip-filter-label">Trip</InputLabel>
              <Select
                labelId="log-trip-filter-label"
                label="Trip"
                value={filters.tripId}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    tripId: value === "all" ? "all" : Number(value),
                  }));
                }}
              >
                <MenuItem value="all">All trips</MenuItem>
                {tripsWithLogs.map((trip) => (
                  <MenuItem key={trip.id} value={trip.id}>
                    #{trip.id} — {trip.pickup_location} →{" "}
                    {trip.dropoff_location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {hasActiveFilters && (
              <Button size="small" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </Box>

          <LogSheetsTable
            rows={pagination.pageItems}
            loading={loading}
            emptyMessage={
              hasActiveFilters
                ? "No log sheets match your filters."
                : "No log sheets for this trip."
            }
          />

          <TablePagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            disabled={loading}
            idPrefix="log-sheets"
          />
        </Box>
      )}
    </Box>
  );
}
