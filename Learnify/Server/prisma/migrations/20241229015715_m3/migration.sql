/*
  Warnings:

  - You are about to drop the column `createdat` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `currentstreak` on the `streak` table. All the data in the column will be lost.
  - You are about to drop the column `lastupdateddate` on the `streak` table. All the data in the column will be lost.
  - You are about to drop the column `longeststreak` on the `streak` table. All the data in the column will be lost.
  - You are about to drop the column `topicname` on the `topic` table. All the data in the column will be lost.
  - The primary key for the `trackhabit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `iscompleted` on the `trackhabit` table. All the data in the column will be lost.
  - You are about to drop the column `trackdate` on the `trackhabit` table. All the data in the column will be lost.
  - You are about to drop the column `trackid` on the `trackhabit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[habitid,trackDate]` on the table `trackhabit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastUpdatedDate` to the `streak` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicName` to the `topic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackDate` to the `trackhabit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "unique_habit_per_day";

-- AlterTable
ALTER TABLE "habit" DROP COLUMN "createdat",
ADD COLUMN     "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "streak" DROP COLUMN "currentstreak",
DROP COLUMN "lastupdateddate",
DROP COLUMN "longeststreak",
ADD COLUMN     "currentStreak" INTEGER DEFAULT 0,
ADD COLUMN     "lastUpdatedDate" DATE NOT NULL,
ADD COLUMN     "longestStreak" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "topic" DROP COLUMN "topicname",
ADD COLUMN     "topicName" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "trackhabit" DROP CONSTRAINT "trackhabit_pkey",
DROP COLUMN "iscompleted",
DROP COLUMN "trackdate",
DROP COLUMN "trackid",
ADD COLUMN     "isCompleted" SMALLINT DEFAULT 0,
ADD COLUMN     "trackDate" DATE NOT NULL,
ADD COLUMN     "trackId" SERIAL NOT NULL,
ADD CONSTRAINT "trackhabit_pkey" PRIMARY KEY ("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_habit_per_day" ON "trackhabit"("habitid", "trackDate");
