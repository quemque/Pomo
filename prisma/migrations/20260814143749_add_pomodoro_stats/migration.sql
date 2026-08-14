/*
  Warnings:

  - You are about to drop the column `phase` on the `FocusSession` table. All the data in the column will be lost.
  - You are about to drop the column `currentSessionNumber` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `longBreakDuration` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `sessionsBeforeLongBreak` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FocusLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAchievement` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roomId,userId]` on the table `RoomParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `breakTime` to the `FocusSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `FocusSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `focusTime` to the `FocusSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FocusLog" DROP CONSTRAINT "FocusLog_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "FocusLog" DROP CONSTRAINT "FocusLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "FocusSession" DROP CONSTRAINT "FocusSession_roomId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- DropIndex
DROP INDEX "RoomParticipant_userId_roomId_key";

-- AlterTable
ALTER TABLE "FocusSession" DROP COLUMN "phase",
ADD COLUMN     "breakTime" INTEGER NOT NULL,
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "focusTime" INTEGER NOT NULL,
ALTER COLUMN "completed" SET DEFAULT true,
ALTER COLUMN "roomId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "currentSessionNumber",
DROP COLUMN "description",
DROP COLUMN "longBreakDuration",
DROP COLUMN "sessionsBeforeLongBreak";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt";

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "FocusLog";

-- DropTable
DROP TABLE "UserAchievement";

-- CreateTable
CREATE TABLE "DailyPomodoroStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "completedSessions" INTEGER NOT NULL DEFAULT 0,
    "interruptedSessions" INTEGER NOT NULL DEFAULT 0,
    "totalFocusSeconds" INTEGER NOT NULL DEFAULT 0,
    "totalBreakSeconds" INTEGER NOT NULL DEFAULT 0,
    "longestSession" INTEGER NOT NULL DEFAULT 0,
    "avgSessionLength" INTEGER NOT NULL DEFAULT 0,
    "roomSessions" INTEGER NOT NULL DEFAULT 0,
    "soloSessions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyPomodoroStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyPomodoroStats_userId_date_idx" ON "DailyPomodoroStats"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPomodoroStats_userId_date_key" ON "DailyPomodoroStats"("userId", "date");

-- CreateIndex
CREATE INDEX "FocusSession_userId_date_idx" ON "FocusSession"("userId", "date");

-- CreateIndex
CREATE INDEX "FocusSession_userId_startedAt_idx" ON "FocusSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "FocusSession_roomId_idx" ON "FocusSession"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomParticipant_roomId_userId_key" ON "RoomParticipant"("roomId", "userId");

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyPomodoroStats" ADD CONSTRAINT "DailyPomodoroStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
