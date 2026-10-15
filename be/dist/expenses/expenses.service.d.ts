import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
export declare class ExpensesService {
    private expensesRepository;
    constructor(expensesRepository: Repository<Expense>);
    create(createExpenseDto: CreateExpenseDto, userId: string): Promise<Expense>;
    findAll(userId: string, query: {
        keyword?: string;
        startDate?: string;
        endDate?: string;
        type?: 'income' | 'expense';
        categoryId?: string;
        minAmount?: number;
        maxAmount?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Expense[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, userId: string): Promise<Expense>;
    update(id: string, updateDto: Partial<CreateExpenseDto>, userId: string): Promise<Expense>;
    remove(id: string, userId: string): Promise<Expense>;
    getStatistics(userId: string, startDate?: string, endDate?: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        byCategory: any[];
    }>;
    getMonthlyReport(userId: string, year: number): Promise<{
        month: number;
        income: number;
        expense: number;
    }[]>;
    findAllAdmin(query: {
        userId?: string;
        keyword?: string;
        startDate?: string;
        endDate?: string;
        type?: 'income' | 'expense';
        categoryId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Expense[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAdminStats(): Promise<{
        totalIncome: number;
        totalExpense: number;
        totalTransactions: number;
        balance: number;
    }>;
    adminDelete(id: string): Promise<{
        message: string;
    }>;
}
