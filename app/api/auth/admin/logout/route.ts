import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ message: "Logged out successfully" })

    // Clear admin token cookie
    response.cookies.set({
      name: "admin_token",
      value: "",
      expires: new Date(0),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Admin logout error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
