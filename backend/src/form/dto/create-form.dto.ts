import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateFormDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isAnonymous: boolean;
}
