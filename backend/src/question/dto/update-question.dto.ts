import { IsString, IsOptional, IsBoolean, IsEnum, IsInt } from 'class-validator';
import { QuestionType } from '@prisma/client';

export class UpdateQuestionDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}
