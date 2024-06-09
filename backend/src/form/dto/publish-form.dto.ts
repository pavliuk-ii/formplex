import { IsBoolean } from 'class-validator';

export class PublishFormDto {
  @IsBoolean()
  isPublished: boolean;
}
