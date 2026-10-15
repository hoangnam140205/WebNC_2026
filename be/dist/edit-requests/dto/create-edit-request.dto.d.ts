export declare class CreateEditRequestDto {
    expenseId: string;
    requestedAmount: number;
    requestedDescription: string;
    requestedNote?: string;
    requestedDate: string;
    requestedType?: 'income' | 'expense';
    requestedCategoryId?: string;
    reason: string;
}
