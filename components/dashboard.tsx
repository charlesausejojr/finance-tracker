"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { filterTransactions } from "@/lib/utils"
import type { Transaction, FilterOptions } from "@/lib/types"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface DashboardProps {
  transactions: Transaction[]
  filters: FilterOptions
}

export function Dashboard({ transactions, filters }: DashboardProps) {
  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, filters)
    return filtered
  }, [transactions, filters])

  const summary = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }, [filteredTransactions])

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {}

    filteredTransactions.forEach((t) => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0
      }
      categoryTotals[t.category] += t.amount
    })

    const data = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }))

    return data
  }, [filteredTransactions])

  const monthlyData = useMemo(() => {
    const monthlyTotals: Record<string, { income: number; expenses: number; timestamp: number }> = {}

    filteredTransactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { income: 0, expenses: 0, timestamp: date.getTime() }
      }

      if (t.type === "income") {
        monthlyTotals[monthKey].income += t.amount
      } else {
        monthlyTotals[monthKey].expenses += t.amount
      }
    })

    const data = Object.entries(monthlyTotals)
      .map(([key, data]) => {
        const [year, month] = key.split("-")
        const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
        return {
          month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          income: data.income,
          expenses: data.expenses,
          timestamp: data.timestamp,
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

    return data
  }, [filteredTransactions])

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-green-600 text-white hover:scale-[1.02] transition-transform duration-200 cursor-default">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Cash In</CardTitle>
            <TrendingUp className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${summary.income.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-600 text-white hover:scale-[1.02] transition-transform duration-200 cursor-default">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Cash Out</CardTitle>
            <TrendingDown className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${summary.expenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card
          className={`${
            summary.balance >= 0 ? "bg-blue-600" : "bg-red-600"
          } text-white hover:scale-[1.02] transition-transform duration-200 cursor-default`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
            <Wallet className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${summary.balance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader>
            <CardTitle className="text-xl">Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ChartContainer
                config={{
                  income: {
                    label: "Cash In",
                    color: "#10b981",
                  },
                  expenses: {
                    label: "Cash Out",
                    color: "#ef4444",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" style={{ fontSize: "14px" }} />
                    <YAxis style={{ fontSize: "14px" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: "16px" }} />
                    <Bar dataKey="income" fill="var(--color-income)" name="Cash In" />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" name="Cash Out" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground text-lg">
                No data to display. Add some transactions to see trends.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader>
            <CardTitle className="text-xl">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ChartContainer
                config={Object.fromEntries(
                  categoryData.map((item, index) => [
                    item.name.toLowerCase().replace(/\s+/g, "-"),
                    {
                      label: item.name,
                      color: COLORS[index % COLORS.length],
                    },
                  ]),
                )}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      style={{ fontSize: "14px" }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground text-lg">
                No data to display. Add some transactions to see category breakdown.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
