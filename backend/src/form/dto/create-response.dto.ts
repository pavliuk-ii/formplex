import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsInt()
  questionId: number;

  @IsOptional()
  @IsInt()
  optionId?: number;

  @IsOptional()
  @IsString()
  text?: string;
}

export class CreateResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
