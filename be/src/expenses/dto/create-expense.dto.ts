import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsDateString()
  date: string;

  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @IsString()
  @IsOptional()
  categoryId?: string;
}
