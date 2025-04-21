"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Wallet } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectButtonProps {
  onSuccess?: (address: string) => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "glow"
}

export function WalletConnectButton({ onSuccess, className, variant = "default" }: WalletConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { connectWallet } = useAuth()
  const { toast } = useToast()

  const handleConnect = async () => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a random wallet address
      const address = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

      // Update user profile with wallet address
      connectWallet(address)

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected",
      })

      if (onSuccess) {
        onSuccess(address)
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)

      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button variant={variant} className={className} onClick={handleConnect} disabled={isConnecting}>
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
