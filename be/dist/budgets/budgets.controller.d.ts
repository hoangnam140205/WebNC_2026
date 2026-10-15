import { BudgetsService } from './budgets.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    create(createBudgetDto: CreateBudgetDto, req: any): Promise<import("./entities/budget.entity.js").Budget>;
    findAll(req: any): Promise<{
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
    findOne(id: string, req: any): Promise<import("./entities/budget.entity.js").Budget>;
    update(id: string, updateDto: Partial<CreateBudgetDto>, req: any): Promise<import("./entities/budget.entity.js").Budget>;
    remove(id: string, req: any): Promise<import("./entities/budget.entity.js").Budget>;
}
