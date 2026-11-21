-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('WANT_TO_READ', 'READING', 'READ');

-- CreateTable
CREATE TABLE "ReadingListItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workId" INTEGER NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'WANT_TO_READ',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingListItem_userId_status_idx" ON "ReadingListItem"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingListItem_userId_workId_key" ON "ReadingListItem"("userId", "workId");

-- AddForeignKey
ALTER TABLE "ReadingListItem" ADD CONSTRAINT "ReadingListItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
