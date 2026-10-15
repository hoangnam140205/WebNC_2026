import type { User } from '../../users/entities/user.entity.js';
import type { Expense } from '../../expenses/entities/expense.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export declare class EditRequest {
    id: string;
    expense: Expense;
    expenseId: string;
    user: User;
    userId: string;
    requestedAmount: number;
    requestedDescription: string;
    requestedNote: string;
    requestedDate: string;
    requestedType: 'income' | 'expense';
    requestedCategory: Category;
    requestedCategoryId: string;
    reason: string;
    status: RequestStatus;
    adminNote: string;
    createdAt: Date;
    updatedAt: Date;
}
