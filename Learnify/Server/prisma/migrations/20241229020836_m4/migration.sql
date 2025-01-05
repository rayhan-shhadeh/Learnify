/*
  Warnings:

  - The `isCompleted` column on the `trackhabit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "trackhabit" DROP COLUMN "isCompleted",
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;
