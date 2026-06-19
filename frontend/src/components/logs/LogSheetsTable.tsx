import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EldLogHoverPreview from "./EldLogHoverPreview";
import type { LogSheetListRow } from "../../types/logSheetList";
import {
  formatDutyHours,
  segmentActivitySummary,
  sumSegmentHours,
} from "../../utils/logSheetMetrics";
import {
  AppTableBody,
  AppTableCell,
  AppTableEmptyRow,
  AppTableHead,
  AppTableHeadCell,
  AppTableLoadingRows,
  AppTableRow,
  SplitScrollTable,
  TableSurface,
} from "../ui/table/AppTable";
import {
  TableTooltipCellContent,
  QuoteColumnHeader,
} from "../ui/table/TableTooltipCell";

const COLUMN_WIDTHS = [
  72, // Trip
  56, // ELD
  140, // Pickup
  140, // Dropoff
  64, // Day
  108, // Date
  108, // ISO date
  140, // From
  140, // To
  88, // Miles
  180, // Remarks
  80, // Segments
  96, // Off duty
  96, // Sleeper
  96, // Driving
  96, // On duty
  200, // Activities
] as const;

const STICKY_LEFT_ELD = COLUMN_WIDTHS[0];

const COLUMN_COUNT = COLUMN_WIDTHS.length;
const TABLE_MIN_WIDTH = COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);

interface LogSheetsTableProps {
  rows: LogSheetListRow[];
  loading?: boolean;
  emptyMessage?: string;
}

interface LogSheetTableRowProps {
  row: LogSheetListRow;
  onOpen: (row: LogSheetListRow) => void;
}

const LogSheetTableRow = memo(function LogSheetTableRow({
  row,
  onOpen,
}: LogSheetTableRowProps) {
  const { sheet } = row;
  const activities = segmentActivitySummary(sheet.segments);

  return (
    <AppTableRow onClick={() => onOpen(row)}>
      <AppTableCell minWidth={COLUMN_WIDTHS[0]} stickyLeftOffset={0}>
        #{row.tripId}
      </AppTableCell>
      <AppTableCell
        minWidth={COLUMN_WIDTHS[1]}
        stickyLeftOffset={STICKY_LEFT_ELD}
      >
        <EldLogHoverPreview sheet={sheet} />
      </AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[2]} title={row.pickupLocation}>
        {row.pickupLocation}
      </AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[3]} title={row.dropoffLocation}>
        {row.dropoffLocation}
      </AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[4]}>{sheet.day_number}</AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[5]}>{sheet.date_display}</AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[6]} nowrap>
        {sheet.date}
      </AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[7]} title={sheet.from_location}>
        {sheet.from_location}
      </AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[8]} title={sheet.to_location}>
        {sheet.to_location}
      </AppTableCell>
      <AppTableCell align="right" minWidth={COLUMN_WIDTHS[9]}>
        {sheet.total_miles}
      </AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[10]}>
        <TableTooltipCellContent text={sheet.remarks} label="Remarks" />
      </AppTableCell>
      <AppTableCell align="right" minWidth={COLUMN_WIDTHS[11]}>
        {sheet.segments.length}
      </AppTableCell>
      <AppTableCell align="right" minWidth={COLUMN_WIDTHS[12]}>
        {formatDutyHours(sumSegmentHours(sheet.segments, "off_duty"))}
      </AppTableCell>
      <AppTableCell align="right" minWidth={COLUMN_WIDTHS[13]}>
        {formatDutyHours(sumSegmentHours(sheet.segments, "sleeper"))}
      </AppTableCell>
      <AppTableCell align="right" minWidth={COLUMN_WIDTHS[14]}>
        {formatDutyHours(sumSegmentHours(sheet.segments, "driving"))}
      </AppTableCell>
      <AppTableCell align="right" minWidth={COLUMN_WIDTHS[15]}>
        {formatDutyHours(sumSegmentHours(sheet.segments, "on_duty"))}
      </AppTableCell>
      <AppTableCell minWidth={COLUMN_WIDTHS[16]}>
        <TableTooltipCellContent
          text={activities === "—" ? "" : activities}
          label="Activities"
          listStyle
        />
      </AppTableCell>
    </AppTableRow>
  );
});

function LogSheetsTable({
  rows,
  loading = false,
  emptyMessage = "No log sheets match your filters.",
}: LogSheetsTableProps) {
  const navigate = useNavigate();

  const openDetail = useCallback(
    (row: LogSheetListRow) => {
      navigate(`/logs/${row.tripId}/${row.sheet.day_number}`);
    },
    [navigate],
  );

  const tableHeader = (
    <AppTableHead sticky>
      <AppTableRow>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[0]} stickyLeftOffset={0}>
          Trip
        </AppTableHeadCell>
        <AppTableHeadCell
          minWidth={COLUMN_WIDTHS[1]}
          stickyLeftOffset={STICKY_LEFT_ELD}
        >
          ELD
        </AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[2]}>Pickup</AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[3]}>Dropoff</AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[4]}>Day</AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[5]}>Date</AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[6]}>
          ISO date
        </AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[7]}>From</AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[8]}>To</AppTableHeadCell>
        <AppTableHeadCell align="right" minWidth={COLUMN_WIDTHS[9]}>
          Miles
        </AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[10]}>
          <QuoteColumnHeader label="Remarks" />
        </AppTableHeadCell>
        <AppTableHeadCell align="right" minWidth={COLUMN_WIDTHS[11]}>
          Segments
        </AppTableHeadCell>
        <AppTableHeadCell align="right" minWidth={COLUMN_WIDTHS[12]}>
          Off duty
        </AppTableHeadCell>
        <AppTableHeadCell align="right" minWidth={COLUMN_WIDTHS[13]}>
          Sleeper
        </AppTableHeadCell>
        <AppTableHeadCell align="right" minWidth={COLUMN_WIDTHS[14]}>
          Driving
        </AppTableHeadCell>
        <AppTableHeadCell align="right" minWidth={COLUMN_WIDTHS[15]}>
          On duty
        </AppTableHeadCell>
        <AppTableHeadCell minWidth={COLUMN_WIDTHS[16]}>
          <QuoteColumnHeader label="Activities" />
        </AppTableHeadCell>
      </AppTableRow>
    </AppTableHead>
  );

  return (
    <TableSurface scroll plain sx={{ flex: 1, minHeight: 0 }}>
      <SplitScrollTable
        columns={[...COLUMN_WIDTHS]}
        minWidth={TABLE_MIN_WIDTH}
        aria-label="Log sheets"
        header={tableHeader}
      >
        <AppTableBody>
          {loading ? (
            <AppTableLoadingRows colSpan={COLUMN_COUNT} />
          ) : rows.length === 0 ? (
            <AppTableEmptyRow colSpan={COLUMN_COUNT} message={emptyMessage} />
          ) : (
            rows.map((row) => (
              <LogSheetTableRow key={`${row.tripId}-${row.sheet.day_number}`} row={row} onOpen={openDetail} />
            ))
          )}
        </AppTableBody>
      </SplitScrollTable>
    </TableSurface>
  );
}

export default memo(LogSheetsTable);
