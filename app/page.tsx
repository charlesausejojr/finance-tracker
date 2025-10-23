"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Dashboard from "./dashboard/page"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return <Dashboard />
}
