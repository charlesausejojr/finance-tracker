/*
  Warnings:

  - You are about to drop the column `transactionId` on the `categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[categories] DROP CONSTRAINT [categories_transactionId_fkey];

-- DropIndex
DROP INDEX [categories_transactionId_idx] ON [dbo].[categories];

-- AlterTable
ALTER TABLE [dbo].[categories] DROP COLUMN [transactionId];

-- AlterTable
ALTER TABLE [dbo].[transactions] ADD [categoryId] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[categories] ADD CONSTRAINT [categories_title_key] UNIQUE NONCLUSTERED ([title]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_categoryId_idx] ON [dbo].[transactions]([categoryId]);

-- AddForeignKey
ALTER TABLE [dbo].[transactions] ADD CONSTRAINT [transactions_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[categories]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
