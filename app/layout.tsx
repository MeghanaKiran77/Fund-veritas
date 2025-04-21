import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/auth-context"
import { NotificationProvider } from "@/context/notification-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "FundVeritas - Transparent Crowdfunding via Blockchain",
  description: "Build trust through milestones and decentralization",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
