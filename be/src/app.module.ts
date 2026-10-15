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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: Number(configService.get<number>('DB_PORT')) || 3306,
        username: configService.get<string>('DB_USERNAME') || 'root',
        password: configService.get<string>('DB_PASSWORD') || '123456',
        database: (configService.get<string>('DB_DATABASE') || 'expense_manager') as string,
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
export class AppModule {}
