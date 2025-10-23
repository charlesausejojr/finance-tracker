import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createUserSchema } from "@/lib/validation"
import { ApiError, handleError } from "@/lib/errors"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        balance: true,
        createdAt: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    const { status, body } = handleError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: validatedData.email }, { username: validatedData.username }],
      },
    })

    if (existingUser) {
      throw new ApiError(409, "User with this email or username already exists")
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        balance: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    const { status, body } = handleError(error)
    return NextResponse.json(body, { status })
  }
}
