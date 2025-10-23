import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTransactionSchema } from "@/lib/validation";
import { ApiError, handleError } from "@/lib/errors";
import { calculateBalanceChange, getCategory } from "@/lib/transactions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: { select: { title: true } },
      },
    });

    if (!transaction) {
      throw new ApiError(404, "Transaction not found");
    }

    return NextResponse.json(transaction);
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Allow partial fields — we’ll use .partial() version of schema
    const validated = updateTransactionSchema.partial().parse(body);

    // Check if transaction exists
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Transaction not found");

    // Determine category if title is provided
    let categoryId = existing.categoryId;
    if (validated.categoryTitle) {
      const category = await getCategory(validated.categoryTitle);
      categoryId = category?.id ?? existing.categoryId;
    }

    // Handle amount/type/balance changes if provided
    let delta = 0;
    const newAmount = validated.amount ?? existing.amount;
    const newType = validated.type ?? existing.type;

    if (existing.type !== newType) {
      // Type changed: reverse old + apply new
      delta += calculateBalanceChange(existing.type, existing.amount, true);
      delta += calculateBalanceChange(newType, newAmount);
    } else if (
      validated.amount !== undefined &&
      existing.amount !== validated.amount
    ) {
      // Same type, amount changed
      delta += calculateBalanceChange(newType, newAmount - existing.amount);
    }

    // Update only provided fields
    const updateData = {
      ...validated,
      categoryId,
    };

    const [updatedTransaction, updatedUser] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id },
        data: updateData,
        include: {
          user: { select: { username: true, email: true } },
          category: { select: { title: true } },
        },
      }),
      prisma.user.update({
        where: { id: existing.userId! },
        data: { balance: { increment: delta } },
      }),
    ]);

    return NextResponse.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
      user: updatedUser,
    });
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new ApiError(404, "Transaction not found");

    // Reverse the balance effect
    const delta = calculateBalanceChange(
      transaction.type,
      transaction.amount,
      true
    );

    const [deleted, updatedUser] = await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),
      prisma.user.update({
        where: { id: transaction.id },
        data: { balance: { increment: delta } },
      }),
    ]);

    return NextResponse.json(
      {
        message: "Transaction deleted successfully",
        deleted,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}
