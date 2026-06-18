import type { LogSegment } from "../types/trip";

export function sumSegmentHours(
  segments: readonly LogSegment[],
  status?: LogSegment["status"],
): number {
  return segments
    .filter((segment) => status === undefined || segment.status === status)
    .reduce((sum, segment) => sum + (segment.end - segment.start), 0);
}

export function formatDutyHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`;
}

export function segmentActivitySummary(segments: readonly LogSegment[]): string {
  if (segments.length === 0) return "—";
  return segments.map((segment) => segment.label).join("; ");
}
