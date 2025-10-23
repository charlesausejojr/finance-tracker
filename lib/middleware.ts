import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./jwt"

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
    // Add user info to request for use in handler
    ;(request as any).user = decoded

    return handler(request)
  }
}
