import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a single user
  const user = await prisma.user.create({
    data: {
      username: "john_doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
      balance: 5000,
    },
  });

  // Create multiple transactions for that user
  const transactions = await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        description: "Salary deposit",
        amount: 5000,
        type: "income",
      },
      {
        userId: user.id,
        description: "Grocery shopping",
        amount: 150,
        type: "expense",
      },
      {
        userId: user.id,
        description: "Online subscription",
        amount: 50,
        type: "expense",
      },
      {
        userId: user.id,
        description: "Freelance payment",
        amount: 1200,
        type: "income",
      },
    ],
  });

  // Fetch the created transactions (to get their IDs)
  const createdTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
  });

  // Create categories for the transactions
  const categoriesData = [
    { transactionId: createdTransactions[0].id, title: "Salary" },
    { transactionId: createdTransactions[1].id, title: "Food & Groceries" },
    { transactionId: createdTransactions[2].id, title: "Subscriptions" },
    { transactionId: createdTransactions[3].id, title: "Freelance" },
  ];

  await prisma.category.createMany({
    data: categoriesData,
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
