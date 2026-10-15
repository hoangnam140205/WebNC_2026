import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { Expense } from '../expenses/entities/expense.entity.js';
export declare class BudgetsService {
    private budgetsRepository;
    private expensesRepository;
    constructor(budgetsRepository: Repository<Budget>, expensesRepository: Repository<Expense>);
    create(createBudgetDto: CreateBudgetDto, userId: string): Promise<Budget>;
    findAll(userId: string): Promise<{
        spent: number;
        remaining: number;
        percentage: number;
        id: string;
        name: string;
        amount: number;
        period: "monthly" | "weekly" | "yearly";
        startDate: string;
        endDate: string;
        category: import("../categories/entities/category.entity.js").Category;
        categoryId: string;
        user: import("../users/entities/user.entity.js").User;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string, userId: string): Promise<Budget>;
    update(id: string, updateDto: Partial<CreateBudgetDto>, userId: string): Promise<Budget>;
    remove(id: string, userId: string): Promise<Budget>;
}
