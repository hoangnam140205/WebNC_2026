export declare class CreateExpenseDto {
    amount: number;
    description: string;
    note?: string;
    date: string;
    type: 'income' | 'expense';
    categoryId?: string;
}
