import type { Expense } from '../../expenses/entities/expense.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';
import type { Budget } from '../../budgets/entities/budget.entity.js';
import type { EditRequest } from '../../edit-requests/entities/edit-request.entity.js';
export type UserRole = 'admin' | 'user';
export declare class User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    editRequests: EditRequest[];
}
