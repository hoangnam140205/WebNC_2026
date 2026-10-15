import { IsOptional, IsString } from 'class-validator';

export class ReviewEditRequestDto {
  @IsOptional()
  @IsString()
  adminNote?: string;
}
