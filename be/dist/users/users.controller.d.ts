import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity.js").User[]>;
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: import("./entities/user.entity.js").UserRole;
        isActive: boolean;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        expenses: import("../expenses/entities/expense.entity.js").Expense[];
        categories: import("../categories/entities/category.entity.js").Category[];
        budgets: import("../budgets/entities/budget.entity.js").Budget[];
        editRequests: import("../edit-requests/entities/edit-request.entity.js").EditRequest[];
    }>;
    findOne(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: import("./entities/user.entity.js").UserRole;
        isActive: boolean;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        expenses: import("../expenses/entities/expense.entity.js").Expense[];
        categories: import("../categories/entities/category.entity.js").Category[];
        budgets: import("../budgets/entities/budget.entity.js").Budget[];
        editRequests: import("../edit-requests/entities/edit-request.entity.js").EditRequest[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: import("./entities/user.entity.js").UserRole;
        isActive: boolean;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        expenses: import("../expenses/entities/expense.entity.js").Expense[];
        categories: import("../categories/entities/category.entity.js").Category[];
        budgets: import("../budgets/entities/budget.entity.js").Budget[];
        editRequests: import("../edit-requests/entities/edit-request.entity.js").EditRequest[];
    }>;
    toggleActive(id: string, req: any): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: import("./entities/user.entity.js").UserRole;
        isActive: boolean;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        expenses: import("../expenses/entities/expense.entity.js").Expense[];
        categories: import("../categories/entities/category.entity.js").Category[];
        budgets: import("../budgets/entities/budget.entity.js").Budget[];
        editRequests: import("../edit-requests/entities/edit-request.entity.js").EditRequest[];
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
