import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { generateToken } from "@/lib/jwt";
import { ApiError, handleError, handleZodErrors } from "@/lib/errors";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return NextResponse.json(
      {
        message: "Login successful",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodErrors(error, "Validation Failed.");
    }
    const { status, body } = handleError(error);
    console.log(error);

    return NextResponse.json(body, { status });
  }
}
