"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { filterTransactions } from "@/lib/utils"
import { updateTransaction, deleteTransaction } from "@/lib/storage"
import type { Transaction, FilterOptions, Category } from "@/lib/types"
import { Pencil, Trash2, TrendingUp, TrendingDown, FileText } from "lucide-react"

interface TransactionHistoryProps {
  transactions: Transaction[]
  filters: FilterOptions
  categories: Category[]
  onTransactionUpdated: () => void
  onGeneratePDF: () => void
}

export function TransactionHistory({
  transactions,
  filters,
  categories,
  onTransactionUpdated,
  onGeneratePDF,
}: TransactionHistoryProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    amount: "",
    date: "",
  })

  const filteredTransactions = useMemo(() => filterTransactions(transactions, filters), [transactions, filters])

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setEditForm({
      name: transaction.name,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().split("T")[0],
    })
  }

  const handleSaveEdit = () => {
    if (!editingTransaction) return

    const amountNum = Number.parseFloat(editForm.amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount")
      return
    }

    updateTransaction(editingTransaction.id, {
      name: editForm.name,
      category: editForm.category,
      amount: amountNum,
      date: new Date(editForm.date).toISOString(),
    })

    setEditingTransaction(null)
    onTransactionUpdated()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id)
      onTransactionUpdated()
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Transaction History</CardTitle>
          <Button
            onClick={onGeneratePDF}
            variant="outline"
            size="lg"
            className="h-12 px-6 text-base font-semibold border-2 border-black hover:bg-muted cursor-pointer bg-white"
          >
            <FileText className="mr-2 h-5 w-5" />
            Generate PDF
          </Button>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-lg text-muted-foreground py-8">
              No transactions found. Add your first transaction above!
            </p>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`rounded-full p-2 ${
                        transaction.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold truncate">{transaction.name}</p>
                      <p className="text-base text-muted-foreground">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(transaction)}
                      className="h-10 w-10 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit transaction</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                      className="h-10 w-10 hover:bg-red-100 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete transaction</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-base">
                Description
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-base">
                Category
              </Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger className="h-11 text-base bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border shadow-lg">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name} className="text-base py-3 cursor-pointer">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount" className="text-base">
                Amount ($)
              </Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date" className="text-base">
                Date
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="h-11 text-base"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingTransaction(null)}
              className="h-11 text-base cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="h-11 text-base cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
