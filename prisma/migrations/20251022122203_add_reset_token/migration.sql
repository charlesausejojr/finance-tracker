/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[users] ADD [resetToken] NVARCHAR(1000),
[resetTokenExpiry] DATETIME2;

-- CreateIndex
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_resetToken_key] UNIQUE NONCLUSTERED ([resetToken]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
