"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTransaction } from "@/lib/storage";
import type { Category } from "@/lib/types";
import { Plus, Minus, X, Settings } from "lucide-react";
import { CategoryManagerModal } from "@/components/category-manager-modal";
import { cn } from "@/lib/utils";

interface TransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onTransactionAdded: () => void;
  onCategoriesUpdated: () => void;
}

export function TransactionDrawer({
  isOpen,
  onClose,
  categories,
  onTransactionAdded,
  onCategoriesUpdated,
}: TransactionDrawerProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setCategory("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen]);

  const handleSubmit = (type: "income" | "expense") => {
    if (!name || !category || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const amountNum = Number.parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    addTransaction({
      name,
      category,
      amount: amountNum,
      type,
      date: new Date(date).toISOString(),
    });

    // Reset form
    setName("");
    setCategory("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);

    onTransactionAdded();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-2xl font-bold text-foreground">
              Add Transaction
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 hover:bg-muted cursor-pointer"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
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

              {/* Category Select with Manage Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="category" className="text-lg">
                    Category
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="h-8 text-sm hover:bg-muted cursor-pointer"
                  >
                    <Settings className="mr-1 h-4 w-4" />
                    Manage
                  </Button>
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 text-lg bg-white w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border border-border shadow-lg z-[60] w-[var(--radix-select-trigger-width)] max-h-[300px]"
                    //  position="popper"
                    // sideOffset={4}
                  >
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.name}
                        className="text-lg py-3 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
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
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="border-t border-border p-6 bg-white">
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleSubmit("income")}
                className="h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white cursor-pointer transition-colors"
                size="lg"
              >
                <Plus className="mr-2 h-6 w-6" />
                Add Cash In
              </Button>
              <Button
                onClick={() => handleSubmit("expense")}
                className="h-14 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
                size="lg"
              >
                <Minus className="mr-2 h-6 w-6" />
                Add Cash Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onCategoriesUpdated={onCategoriesUpdated}
      />
    </>
  );
}
