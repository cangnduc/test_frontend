/*
  Warnings:

  - You are about to drop the column `created_at_id` on the `question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_created_at_id_fkey";

-- DropIndex
DROP INDEX "question_created_at_id_idx";

-- AlterTable
ALTER TABLE "question" DROP COLUMN "created_at_id",
ADD COLUMN     "created_by_id" INTEGER;

-- CreateIndex
CREATE INDEX "question_created_by_id_idx" ON "question"("created_by_id");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
