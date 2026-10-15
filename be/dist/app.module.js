var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { BudgetsModule } from './budgets/budgets.module.js';
import { UsersModule } from './users/users.module.js';
import { EditRequestsModule } from './edit-requests/edit-requests.module.js';
import { User } from './users/entities/user.entity.js';
import { Category } from './categories/entities/category.entity.js';
import { Expense } from './expenses/entities/expense.entity.js';
import { Budget } from './budgets/entities/budget.entity.js';
import { EditRequest } from './edit-requests/entities/edit-request.entity.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({ isGlobal: true }),
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST') || 'localhost',
                    port: Number(configService.get('DB_PORT')) || 3306,
                    username: configService.get('DB_USERNAME') || 'root',
                    password: configService.get('DB_PASSWORD') || '123456',
                    database: (configService.get('DB_DATABASE') || 'expense_manager'),
                    entities: [User, Category, Expense, Budget, EditRequest],
                    synchronize: true,
                }),
                inject: [ConfigService],
            }),
            AuthModule,
            UsersModule,
            CategoriesModule,
            ExpensesModule,
            BudgetsModule,
            EditRequestsModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map