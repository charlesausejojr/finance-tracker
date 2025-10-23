import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { generateResetToken } from "@/lib/jwt";
import { handleError, handleZodErrors } from "@/lib/errors";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a reset link has been sent",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken(user.id, user.email);

    // Save reset token to database with expiry (1 hour)
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: expiryTime,
      },
    });

    // In production, send email with reset link
    // For now, return the token (in production, never return the token in response)
    console.log(`Reset token for ${user.email}: ${resetToken}`);

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a reset link has been sent",
        // Remove this in production - only for testing
        resetToken:
          process.env.NODE_ENV === "development" ? resetToken : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodErrors(error, "Validation Failed.");
    }
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}
