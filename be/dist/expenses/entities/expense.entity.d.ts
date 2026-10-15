import type { User } from '../../users/entities/user.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';
import type { EditRequest } from '../../edit-requests/entities/edit-request.entity.js';
export declare class Expense {
    id: string;
    amount: number;
    description: string;
    note: string;
    date: string;
    type: 'income' | 'expense';
    category: Category;
    categoryId: string;
    user: User;
    userId: string;
    editRequests: EditRequest[];
    createdAt: Date;
    updatedAt: Date;
}
