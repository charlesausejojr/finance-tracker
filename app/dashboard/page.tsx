"use client"

import { useState, useEffect } from "react"
import { TransactionDrawer } from "@/components/transaction-drawer"
import { Dashboard } from "@/components/dashboard"
import { TransactionHistory } from "@/components/transaction-history"
import { Filters } from "@/components/filters"
import { generatePDFReport } from "@/lib/pdf-generator"
import { getTransactions, getCategories } from "@/lib/storage"
import type { Transaction, Category, FilterOptions } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pendingFilters, setPendingFilters] = useState<FilterOptions>({
    dateFrom: "",
    dateTo: "",
    category: "all",
    sortBy: "date-desc",
  })
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
    dateFrom: "",
    dateTo: "",
    category: "all",
    sortBy: "date-desc",
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Load data on mount
  useEffect(() => {
    setTransactions(getTransactions())
    setCategories(getCategories())
  }, [])

  const handleTransactionAdded = () => {
    setTransactions(getTransactions())
  }

  const handleTransactionUpdated = () => {
    setTransactions(getTransactions())
  }

  const handleCategoriesUpdated = () => {
    setCategories(getCategories())
  }

  const handleGeneratePDF = () => {
    generatePDFReport(transactions, appliedFilters)
  }

  const handleFilterSubmit = () => {
    setAppliedFilters(pendingFilters)
  }

  const handleFilterClear = () => {
    const clearedFilters = {
      dateFrom: "",
      dateTo: "",
      category: "all",
      sortBy: "date-desc" as const,
    }
    setPendingFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl text-balance">My Money Tracker</h1>
            <p className="mt-3 text-xl text-muted-foreground">Keep track of your daily finances with ease</p>
          </div>
          <Button
            onClick={() => setIsDrawerOpen(true)}
            size="lg"
            className="h-14 px-6 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shrink-0"
          >
            <Plus className="mr-2 h-6 w-6" />
            Add Transaction
          </Button>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Filters */}
          <section>
            <Filters
              filters={pendingFilters}
              categories={categories}
              onFiltersChange={setPendingFilters}
              onSubmit={handleFilterSubmit}
              onClear={handleFilterClear}
            />
          </section>

          {/* Dashboard */}
          <section>
            <Dashboard transactions={transactions} filters={appliedFilters} />
          </section>

          {/* Transaction History */}
          <section>
            <TransactionHistory
              transactions={transactions}
              filters={appliedFilters}
              categories={categories}
              onTransactionUpdated={handleTransactionUpdated}
              onGeneratePDF={handleGeneratePDF}
            />
          </section>
        </div>
      </div>

      <TransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
        onTransactionAdded={handleTransactionAdded}
        onCategoriesUpdated={handleCategoriesUpdated}
      />
    </div>
  )
}
