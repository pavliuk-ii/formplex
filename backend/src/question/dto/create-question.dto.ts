import { IsString, IsBoolean, IsEnum } from 'class-validator';
import { QuestionType } from '@prisma/client';

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  text: string;

  @IsBoolean()
  isRequired: boolean;
}
