import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Transaction, FilterOptions } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterTransactions(transactions: Transaction[], filters: FilterOptions): Transaction[] {
  let filtered = [...transactions]

  // Filter by date range
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    filtered = filtered.filter((t) => new Date(t.date) >= fromDate)
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    toDate.setHours(23, 59, 59, 999) // Include the entire day
    filtered = filtered.filter((t) => new Date(t.date) <= toDate)
  }

  // Filter by category
  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter((t) => t.category === filters.category)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "amount-desc":
        return b.amount - a.amount
      case "amount-asc":
        return a.amount - b.amount
      default:
        return 0
    }
  })

  return filtered
}
