import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

/** Shared contract for client- or server-driven table pagination. */
export interface TablePaginationProps {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  disabled?: boolean
  /** Prefix for aria ids when multiple pagers exist on one page. */
  idPrefix?: string
}

function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  disabled = false,
  idPrefix = 'table',
}: TablePaginationProps) {
  const totalPages = totalItems <= 0 ? 0 : Math.ceil(totalItems / pageSize)
  const canPrev = page > 1
  const canNext = page < totalPages

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, totalItems)
  const labelId = `${idPrefix}-pagination-label`

  return (
    <Box
      component="nav"
      aria-label="Table pagination"
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        pt: 2,
      }}
    >
      <Typography id={labelId} variant="body2" color="text.secondary">
        {totalItems === 0
          ? 'No results'
          : `Showing ${rangeStart}–${rangeEnd} of ${totalItems}`}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: 0.5,
        }}
        aria-labelledby={labelId}
      >
        <IconButton
          size="small"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || !canPrev}
          aria-label="Previous page"
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        {totalPages > 0 && (
          <Typography variant="body2" aria-live="polite" sx={{ px: 1.5, minWidth: 64, textAlign: 'center' }}>
            {page} / {totalPages}
          </Typography>
        )}

        <IconButton
          size="small"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || !canNext}
          aria-label="Next page"
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default memo(TablePagination)
