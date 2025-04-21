"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"backer" | "creator">("backer")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Login with the selected role
    login(email, role)

    // Show success message
    toast({
      title: "Login successful",
      description: `Welcome back! You are now logged in as a ${role}.`,
    })

    // Redirect to the appropriate dashboard
    router.push(role === "creator" ? "/dashboard/creator" : "/dashboard/backer")

    setIsLoading(false)
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your email to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "backer" | "creator")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="backer" id="login-backer" />
                  <Label htmlFor="login-backer">Backer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creator" id="login-creator" />
                  <Label htmlFor="login-creator">Creator</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
