import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";
import { verifyResetToken } from "@/lib/jwt";
import { ApiError, handleError, handleZodErrors } from "@/lib/errors";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = resetPasswordSchema.parse(body);
    console.log(validatedData);

    // Verify reset token
    const decoded = verifyResetToken(validatedData.token);
    if (!decoded) {
      throw new ApiError(401, "Invalid or expired reset token");
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.resetToken || user.resetToken !== validatedData.token) {
      throw new ApiError(401, "Invalid or expired reset token");
    }

    // Check if token has expired
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw new ApiError(401, "Reset token has expired");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message: "Password reset successful",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodErrors(error, "Validation Failed.");
    }

    // handle other errors normally
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}
