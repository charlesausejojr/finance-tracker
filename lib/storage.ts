import type { Transaction, Category } from "./types"

const STORAGE_KEY = "finance_tracker_data"
const ENCRYPTION_KEY = "user_finance_secure_key_v1"

// Simple encryption for local storage (basic security)
function encrypt(data: string): string {
  // In a real app, use a proper encryption library
  // This is a simple obfuscation for demonstration
  return btoa(data)
}

function decrypt(data: string): string {
  try {
    return atob(data)
  } catch {
    return ""
  }
}

interface StorageData {
  transactions: Transaction[]
  categories: Category[]
}

function getStorageData(): StorageData {
  if (typeof window === "undefined") {
    return { transactions: [], categories: getDefaultCategories() }
  }

  const encrypted = localStorage.getItem(STORAGE_KEY)
  if (!encrypted) {
    const defaultData = { transactions: [], categories: getDefaultCategories() }
    saveStorageData(defaultData)
    return defaultData
  }

  try {
    const decrypted = decrypt(encrypted)
    return JSON.parse(decrypted)
  } catch {
    return { transactions: [], categories: getDefaultCategories() }
  }
}

function saveStorageData(data: StorageData): void {
  if (typeof window === "undefined") return

  const encrypted = encrypt(JSON.stringify(data))
  localStorage.setItem(STORAGE_KEY, encrypted)
}

function getDefaultCategories(): Category[] {
  return [
    { id: "1", name: "Salary" },
    { id: "2", name: "Groceries" },
    { id: "3", name: "Bills" },
    { id: "4", name: "Transportation" },
    { id: "5", name: "Healthcare" },
    { id: "6", name: "Entertainment" },
    { id: "7", name: "Other" },
  ]
}

export function getTransactions(): Transaction[] {
  return getStorageData().transactions
}

export function getCategories(): Category[] {
  return getStorageData().categories
}

export function addTransaction(transaction: Omit<Transaction, "id">): void {
  const data = getStorageData()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  }
  data.transactions.push(newTransaction)
  saveStorageData(data)
}

export function updateTransaction(id: string, updates: Partial<Omit<Transaction, "id" | "type">>): void {
  const data = getStorageData()
  const index = data.transactions.findIndex((t) => t.id === id)
  if (index !== -1) {
    data.transactions[index] = { ...data.transactions[index], ...updates }
    saveStorageData(data)
  }
}

export function deleteTransaction(id: string): void {
  const data = getStorageData()
  data.transactions = data.transactions.filter((t) => t.id !== id)
  saveStorageData(data)
}

export function addCategory(name: string): void {
  const data = getStorageData()
  const exists = data.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())
  if (!exists) {
    data.categories.push({
      id: Date.now().toString(),
      name,
    })
    saveStorageData(data)
  }
}

export function updateCategory(id: string, name: string): void {
  const data = getStorageData()
  const index = data.categories.findIndex((c) => c.id === id)
  if (index !== -1) {
    const oldName = data.categories[index].name
    data.categories[index].name = name

    // Update all transactions that use this category
    data.transactions.forEach((t) => {
      if (t.category === oldName) {
        t.category = name
      }
    })

    saveStorageData(data)
  }
}

export function deleteCategory(id: string): void {
  const data = getStorageData()
  const category = data.categories.find((c) => c.id === id)
  if (!category) return

  // Check if any transactions use this category
  const hasTransactions = data.transactions.some((t) => t.category === category.name)
  if (hasTransactions) {
    throw new Error("Cannot delete category that is in use by transactions")
  }

  data.categories = data.categories.filter((c) => c.id !== id)
  saveStorageData(data)
}
