import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@prisma/client';
import { UpdateOptionDto } from './update-option.dto';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  options?: UpdateOptionDto[];
}
