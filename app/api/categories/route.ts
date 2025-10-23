import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validation";
import { ApiError, handleError } from "@/lib/errors";
//works
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);
    const category = await prisma.category.create({
      data: validatedData,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}
