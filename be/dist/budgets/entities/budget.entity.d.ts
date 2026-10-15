import type { User } from '../../users/entities/user.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';
export declare class Budget {
    id: string;
    name: string;
    amount: number;
    spent: number;
    period: 'monthly' | 'weekly' | 'yearly';
    startDate: string;
    endDate: string;
    category: Category;
    categoryId: string;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
