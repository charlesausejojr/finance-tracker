import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { Transaction, FilterOptions } from "./types"
import { filterTransactions } from "./utils"

export function generatePDFReport(transactions: Transaction[], filters: FilterOptions): void {
  const filteredTransactions = filterTransactions(transactions, filters)

  // Calculate summary
  const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  // Create PDF
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text("Finance Report", 14, 20)

  // Date
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)

  // Summary
  doc.setFontSize(14)
  doc.text("Summary", 14, 40)

  doc.setFontSize(11)
  doc.text(`Total Cash In: $${income.toFixed(2)}`, 14, 48)
  doc.text(`Total Cash Out: $${expenses.toFixed(2)}`, 14, 55)
  doc.text(`Current Balance: $${balance.toFixed(2)}`, 14, 62)

  // Transactions table
  doc.setFontSize(14)
  doc.text("Transactions", 14, 75)

  const tableData = filteredTransactions.map((t) => [
    new Date(t.date).toLocaleDateString(),
    t.name,
    t.category,
    t.type === "income" ? "Cash In" : "Cash Out",
    `$${t.amount.toFixed(2)}`,
  ])

  autoTable(doc, {
    startY: 80,
    head: [["Date", "Description", "Category", "Type", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [72, 118, 128] },
    styles: { fontSize: 10 },
  })

  // Save
  doc.save(`finance-report-${new Date().toISOString().split("T")[0]}.pdf`)
}
