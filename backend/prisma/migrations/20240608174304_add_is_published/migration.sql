/*
  Warnings:

  - You are about to drop the column `formReponseId` on the `question_responses` table. All the data in the column will be lost.
  - Added the required column `formResponseId` to the `question_responses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "question_responses" DROP CONSTRAINT "question_responses_formReponseId_fkey";

-- AlterTable
ALTER TABLE "form_responses" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shuffleAnswers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "question_responses" DROP COLUMN "formReponseId",
ADD COLUMN     "formResponseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "form_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
