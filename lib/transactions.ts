import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";

/**
 * Finds or creates a category by title.
 */
export async function getCategory(title?: string) {
  if (!title) return null;

  let category = await prisma.category.findUnique({ where: { title } });

  return category;
}

/**
 * Calculates how a transaction affects user balance.
 * Returns a positive or negative number.
 */
export function calculateBalanceChange(
  type: string,
  amount: number,
  isReversal = false
) {
  const sign = type === "income" ? 1 : -1;
  return isReversal ? -sign * amount : sign * amount;
}
