/*
  Warnings:

  - Made the column `questionId` on table `question_responses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "question_responses" DROP CONSTRAINT "question_responses_questionId_fkey";

-- AlterTable
ALTER TABLE "options" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "question_responses" ALTER COLUMN "questionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
