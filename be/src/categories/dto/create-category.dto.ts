import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';
}
