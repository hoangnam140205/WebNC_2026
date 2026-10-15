import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAllAdmin(userId?: string, keyword?: string, startDate?: string, endDate?: string, type?: 'income' | 'expense', categoryId?: string, page?: string, limit?: string): Promise<{
        data: import("./entities/expense.entity.js").Expense[];
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
    create(createExpenseDto: CreateExpenseDto, req: any): Promise<import("./entities/expense.entity.js").Expense>;
    findAll(req: any, keyword?: string, startDate?: string, endDate?: string, type?: 'income' | 'expense', categoryId?: string, minAmount?: string, maxAmount?: string, page?: string, limit?: string): Promise<{
        data: import("./entities/expense.entity.js").Expense[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStatistics(req: any, startDate?: string, endDate?: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        byCategory: any[];
    }>;
    getMonthlyReport(req: any, year?: string): Promise<{
        month: number;
        income: number;
        expense: number;
    }[]>;
    findOne(id: string, req: any): Promise<import("./entities/expense.entity.js").Expense>;
    update(id: string, updateDto: Partial<CreateExpenseDto>, req: any): Promise<import("./entities/expense.entity.js").Expense>;
    remove(id: string, req: any): Promise<import("./entities/expense.entity.js").Expense>;
}
