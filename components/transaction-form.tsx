"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTransaction } from "@/lib/storage"
import type { Category } from "@/lib/types"
import { Plus, Minus } from "lucide-react"

interface TransactionFormProps {
  categories: Category[]
  onTransactionAdded: () => void
}

export function TransactionForm({ categories, onTransactionAdded }: TransactionFormProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (type: "income" | "expense") => {
    if (!name || !category || !amount) {
      alert("Please fill in all fields")
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount")
      return
    }

    addTransaction({
      name,
      category,
      amount: amountNum,
      type,
      date: new Date(date).toISOString(),
    })

    // Reset form
    setName("")
    setCategory("")
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])

    onTransactionAdded()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">
              Description
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grocery shopping"
              className="h-12 text-lg"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-lg">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name} className="text-lg py-3">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg">
              Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="h-12 text-lg"
            />
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-lg">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => handleSubmit("income")}
              className="h-14 flex-1 text-lg font-semibold bg-accent hover:bg-accent/90"
              size="lg"
            >
              <Plus className="mr-2 h-6 w-6" />
              Add Cash In
            </Button>
            <Button
              onClick={() => handleSubmit("expense")}
              className="h-14 flex-1 text-lg font-semibold bg-secondary hover:bg-secondary/90"
              size="lg"
            >
              <Minus className="mr-2 h-6 w-6" />
              Add Cash Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
