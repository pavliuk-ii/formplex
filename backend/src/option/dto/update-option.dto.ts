import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateOptionDto {
  @IsOptional()
  @IsString()
  text?: string;
}
