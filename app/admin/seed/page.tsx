"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to seed database")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <Card className="w-full max-w-md border-purple-800/20 bg-background/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Database Seed Tool</CardTitle>
          <CardDescription>
            Populate the database with sample data for testing the admin dashboard and notifications system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert
              variant="success"
              className="border-green-500 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300"
            >
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                <p>{result.message}</p>
                <div className="mt-2">
                  <p>Created:</p>
                  <ul className="list-inside list-disc">
                    <li>{result.stats.users} users</li>
                    <li>{result.stats.projects} projects</li>
                    <li>{result.stats.kycRequests} KYC requests</li>
                    <li>{result.stats.notifications} notifications</li>
                    <li>{result.stats.auditLogs} audit logs</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
            <p className="text-sm font-medium">Warning: This will clear all existing data in the database!</p>
            <p className="mt-1 text-sm">Only use this tool in development environments.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handleSeed} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Database
              </>
            )}
          </Button>
          <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
            Return to admin login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
