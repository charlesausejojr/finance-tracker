import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTransactionSchema } from "@/lib/validation";
import { ApiError, handleError } from "@/lib/errors";
import { calculateBalanceChange, getCategory } from "@/lib/transactions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (category) where.categories = { some: { title: category } };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: { select: { title: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createTransactionSchema.parse(body);
    const { userId, categoryTitle, ...transactionData } = validated;

    // Validate user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    // Ensure category exists
    const category = await getCategory(categoryTitle);

    // Compute balance delta
    const delta = calculateBalanceChange(
      transactionData.type,
      transactionData.amount
    );

    // Run atomically
    const [transaction, updatedUser] = await prisma.$transaction([
      prisma.transaction.create({
        data: { ...transactionData, userId, categoryId: category?.id },
        include: {
          user: {
            select: { username: true, email: true, balance: true },
          },
          category: { select: { title: true } },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: delta } },
      }),
    ]);

    return NextResponse.json(
      { transaction, user: updatedUser },
      { status: 201 }
    );
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}
