import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateEditRequestDto {
  @IsNotEmpty({ message: 'Khoản chi tiêu không được để trống' })
  @IsString()
  expenseId: string;

  @IsNotEmpty({ message: 'Số tiền mới không được để trống' })
  @IsNumber({}, { message: 'Số tiền phải là số' })
  @IsPositive({ message: 'Số tiền phải lớn hơn 0' })
  requestedAmount: number;

  @IsNotEmpty({ message: 'Mô tả mới không được để trống' })
  @IsString()
  requestedDescription: string;

  @IsOptional()
  @IsString()
  requestedNote?: string;

  @IsNotEmpty({ message: 'Ngày mới không được để trống' })
  @IsDateString({}, { message: 'Định dạng ngày không hợp lệ' })
  requestedDate: string;

  @IsOptional()
  @IsIn(['income', 'expense'])
  requestedType?: 'income' | 'expense';

  @IsOptional()
  @IsString()
  requestedCategoryId?: string;

  @IsNotEmpty({ message: 'Lý do yêu cầu chỉnh sửa không được để trống' })
  @IsString()
  reason: string;
}
