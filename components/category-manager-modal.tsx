"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addCategory, deleteCategory, updateCategory } from "@/lib/storage"
import type { Category } from "@/lib/types"
import { Plus, X, Pencil, Trash2, Check } from "lucide-react"

interface CategoryManagerModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onCategoriesUpdated: () => void
}

export function CategoryManagerModal({ isOpen, onClose, categories, onCategoriesUpdated }: CategoryManagerModalProps) {
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name")
      return
    }

    addCategory(newCategory.trim())
    setNewCategory("")
    onCategoriesUpdated()
  }

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const handleSaveEdit = () => {
    if (!editingName.trim() || !editingId) return

    updateCategory(editingId, editingName.trim())
    setEditingId(null)
    setEditingName("")
    onCategoriesUpdated()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id)
      onCategoriesUpdated()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto flex flex-col border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white flex items-center justify-between border-b border-border p-6 z-10">
            <h2 className="text-2xl font-bold text-foreground">Manage Categories</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 hover:bg-muted cursor-pointer">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Add New Category */}
              <div className="space-y-3">
                <Label htmlFor="new-category" className="text-lg">
                  Add New Category
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g., Entertainment"
                    className="h-11 text-base flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddCategory()
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="h-11 px-4 bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Existing Categories - No scrolling here */}
              <div className="space-y-2">
                <Label className="text-lg">Existing Categories</Label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2 p-3 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      {editingId === cat.id ? (
                        <>
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-9 text-base flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEdit()
                              }
                              if (e.key === "Escape") {
                                setEditingId(null)
                                setEditingName("")
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSaveEdit}
                            className="h-9 w-9 hover:bg-green-100 hover:text-green-700 cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingId(null)
                              setEditingName("")
                            }}
                            className="h-9 w-9 hover:bg-muted cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-base font-medium">{cat.name}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStartEdit(cat)}
                              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(cat.id)}
                              className="h-8 w-8 hover:bg-red-100 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-border p-6">
            <Button
              onClick={onClose}
              className="h-12 w-full text-base font-semibold bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
