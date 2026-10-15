import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsIn(['monthly', 'weekly', 'yearly'])
  period: 'monthly' | 'weekly' | 'yearly';

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
