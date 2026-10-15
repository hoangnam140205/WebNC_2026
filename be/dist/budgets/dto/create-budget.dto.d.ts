export declare class CreateBudgetDto {
    name: string;
    amount: number;
    period: 'monthly' | 'weekly' | 'yearly';
    startDate: string;
    endDate: string;
    categoryId?: string;
}
