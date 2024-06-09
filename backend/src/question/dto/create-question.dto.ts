import { IsString, IsBoolean, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@prisma/client';
import { CreateOptionDto } from '../../form/dto/create-option.dto';

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  text: string;

  @IsBoolean()
  isRequired: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
