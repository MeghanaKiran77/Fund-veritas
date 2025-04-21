"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.role === "creator") {
        router.push("/dashboard/creator")
      } else if (user.role === "backer") {
        router.push("/dashboard/backer")
      } else if (user.role === "admin") {
        router.push("/dashboard/admin")
      }
    } else {
      router.push("/login")
    }
  }, [user, router])

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
