export interface Transaction {
  id: string
  name: string
  category: string
  amount: number
  type: "income" | "expense"
  date: string
}

export interface Category {
  id: string
  name: string
}

export interface FilterOptions {
  dateFrom: string
  dateTo: string
  category: string
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
}
