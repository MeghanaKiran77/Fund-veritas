import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const adminPath = request.nextUrl.pathname.startsWith("/dashboard/admin")
  const adminLoginPath = request.nextUrl.pathname === "/admin/login"

  // Skip middleware for non-admin paths and admin login page
  if (!adminPath || adminLoginPath) {
    return NextResponse.next()
  }

  // Check for admin token
  const adminToken = request.cookies.get("admin_token")?.value

  // If no token, redirect to admin login
  if (!adminToken) {
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret")
    const { payload } = await jwtVerify(adminToken, secret)

    // Check if user is admin
    if (payload.role !== "admin") {
      throw new Error("Not authorized as admin")
    }

    return NextResponse.next()
  } catch (error) {
    // Token is invalid or user is not admin
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/dashboard/admin/:path*"],
}
