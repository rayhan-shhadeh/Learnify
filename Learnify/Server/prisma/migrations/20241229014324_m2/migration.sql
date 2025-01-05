/*
  Warnings:

  - The `active` column on the `user_` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_" DROP COLUMN "active",
ADD COLUMN     "active" BOOLEAN DEFAULT true;
