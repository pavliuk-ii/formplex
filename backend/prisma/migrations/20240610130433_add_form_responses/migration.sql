-- AlterTable
ALTER TABLE "options" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "question_responses" ADD COLUMN     "questionId" INTEGER;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
