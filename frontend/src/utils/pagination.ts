/** Visible page numbers with ellipsis for large page counts. */
export function getVisiblePageNumbers(
  current: number,
  total: number,
  siblingCount = 1,
): (number | 'ellipsis')[] {
  if (total <= 1) return total === 1 ? [1] : []

  const totalNumbers = siblingCount * 2 + 3
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(current - siblingCount, 1)
  const rightSibling = Math.min(current + siblingCount, total)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  const pages: (number | 'ellipsis')[] = [1]

  if (showLeftEllipsis) {
    pages.push('ellipsis')
  } else {
    for (let i = 2; i < leftSibling; i += 1) pages.push(i)
  }

  for (let i = leftSibling; i <= rightSibling; i += 1) {
    if (i !== 1 && i !== total) pages.push(i)
  }

  if (showRightEllipsis) {
    pages.push('ellipsis')
  } else {
    for (let i = rightSibling + 1; i < total; i += 1) pages.push(i)
  }

  if (total > 1) pages.push(total)

  return pages
}

export function paginateItems<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0 || pageSize <= 0) return 0
  return Math.ceil(totalItems / pageSize)
}
