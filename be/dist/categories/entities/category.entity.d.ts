import type { User } from '../../users/entities/user.entity.js';
import type { Expense } from '../../expenses/entities/expense.entity.js';
export declare class Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: 'income' | 'expense';
    user: User;
    userId: string;
    expenses: Expense[];
    createdAt: Date;
    updatedAt: Date;
}
