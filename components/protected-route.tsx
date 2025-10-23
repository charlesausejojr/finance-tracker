"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
