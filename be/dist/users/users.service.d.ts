import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CategoriesService } from '../categories/categories.service.js';
export declare class UsersService {
    private usersRepository;
    private categoriesService;
    constructor(usersRepository: Repository<User>, categoriesService: CategoriesService);
    findAll(): Promise<User[]>;
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
    toggleActive(id: string, currentUserId: string): Promise<{
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
    remove(id: string, currentUserId: string): Promise<{
        message: string;
    }>;
}
