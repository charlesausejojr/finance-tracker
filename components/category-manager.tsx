"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addCategory } from "@/lib/storage"
import { Plus } from "lucide-react"

interface CategoryManagerProps {
  onCategoriesUpdated: () => void
}

export function CategoryManager({ onCategoriesUpdated }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name")
      return
    }

    addCategory(newCategory.trim())
    setNewCategory("")
    setIsAdding(false)
    onCategoriesUpdated()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Manage Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {!isAdding ? (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="h-12 w-full text-base" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add New Category
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-category" className="text-lg">
                Category Name
              </Label>
              <Input
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Entertainment"
                className="h-12 text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddCategory()
                  }
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddCategory} className="h-12 flex-1 text-base" size="lg">
                Add Category
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false)
                  setNewCategory("")
                }}
                variant="outline"
                className="h-12 flex-1 text-base"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
