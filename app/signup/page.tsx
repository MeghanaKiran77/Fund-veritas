"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"backer" | "creator">("backer")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { signup } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms and conditions to create an account",
        variant: "destructive",
      })
      return
    }

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

    if (!name) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Sign up with the selected role
    signup(name, email, role)

    // Show success message
    toast({
      title: "Account created",
      description: `Welcome to FundVeritas! Your account has been created successfully.`,
    })

    // Redirect to the appropriate dashboard
    router.push(role === "creator" ? "/dashboard/creator" : "/dashboard/backer")

    setIsLoading(false)
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <Label>Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "backer" | "creator")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="backer" id="backer" />
                  <Label htmlFor="backer">Backer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creator" id="creator" />
                  <Label htmlFor="creator">Creator</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(!!checked)} />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
