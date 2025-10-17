"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterOptions, Category } from "@/lib/types"
import { Filter, Search, X } from "lucide-react"

interface FiltersProps {
  filters: FilterOptions
  categories: Category[]
  onFiltersChange: (filters: FilterOptions) => void
  onSubmit: () => void
  onClear: () => void
}

export function Filters({ filters, categories, onFiltersChange, onSubmit, onClear }: FiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Filter className="h-6 w-6" />
          Filter & Sort
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date-from" className="text-base">
                From Date
              </Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to" className="text-base">
                To Date
              </Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter" className="text-base">
                Category
              </Label>
              <Select
                value={filters.category}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
              >
                <SelectTrigger id="category-filter" className="h-11 text-base bg-white w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border shadow-lg">
                  <SelectItem value="all" className="text-base py-3 cursor-pointer">
                    All Categories
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name} className="text-base py-3 cursor-pointer">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort-by" className="text-base">
                Sort By
              </Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as FilterOptions["sortBy"] })}
              >
                <SelectTrigger id="sort-by" className="h-11 text-base bg-white w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border shadow-lg">
                  <SelectItem value="date-desc" className="text-base py-3 cursor-pointer">
                    Newest First
                  </SelectItem>
                  <SelectItem value="date-asc" className="text-base py-3 cursor-pointer">
                    Oldest First
                  </SelectItem>
                  <SelectItem value="amount-desc" className="text-base py-3 cursor-pointer">
                    Highest Amount
                  </SelectItem>
                  <SelectItem value="amount-asc" className="text-base py-3 cursor-pointer">
                    Lowest Amount
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onSubmit}
              variant="outline"
              className="h-12 flex-1 text-base font-semibold border-2 border-black hover:bg-muted cursor-pointer bg-white"
            >
              <Search className="mr-2 h-5 w-5" />
              Apply Filters
            </Button>
            <Button
              onClick={onClear}
              className="h-12 flex-1 text-base font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              <X className="mr-2 h-5 w-5" />
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
