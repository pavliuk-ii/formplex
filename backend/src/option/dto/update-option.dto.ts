import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateOptionDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  text?: string;
}
