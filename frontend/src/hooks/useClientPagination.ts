import { useCallback, useEffect, useMemo, useState } from 'react'
import { getTotalPages, paginateItems } from '../utils/pagination'

export interface ClientPaginationOptions {
  pageSize?: number
  initialPage?: number
}

/**
 * Client-side pagination hook.
 * Swap `items` for a server fetch + pass `totalItems` from the API to migrate to server-side paging.
 */
export function useClientPagination<T>(
  items: readonly T[],
  { pageSize: initialPageSize = 100, initialPage = 1 }: ClientPaginationOptions = {},
) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const totalItems = items.length
  const totalPages = getTotalPages(totalItems, pageSize)

  useEffect(() => {
    if (totalPages === 0) {
      setPage(1)
      return
    }
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const pageItems = useMemo(
    () => paginateItems(items, page, pageSize),
    [items, page, pageSize],
  )

  const resetPage = useCallback(() => setPage(1), [])

  const setPageSize = useCallback((next: number) => {
    setPageSizeState(next)
    setPage(1)
  }, [])

  const goToPage = useCallback(
    (next: number) => {
      setPage(Math.min(Math.max(1, next), Math.max(totalPages, 1)))
    },
    [totalPages],
  )

  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page])
  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page])

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    pageItems,
    setPage: goToPage,
    setPageSize,
    resetPage,
    nextPage,
    prevPage,
    canPrev: page > 1,
    canNext: page < totalPages,
  }
}

export type ClientPaginationResult<T> = ReturnType<typeof useClientPagination<T>>
