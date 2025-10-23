import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateCategorySchema } from "@/lib/validation";
import { ApiError, handleError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return NextResponse.json(category);
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
    const validatedData = updateCategorySchema.parse(body);

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedCategory);
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
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    const { status, body } = handleError(error);
    return NextResponse.json(body, { status });
  }
}
