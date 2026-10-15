var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsService } from './budgets.service.js';
import { BudgetsController } from './budgets.controller.js';
import { Budget } from './entities/budget.entity.js';
import { Expense } from '../expenses/entities/expense.entity.js';
let BudgetsModule = class BudgetsModule {
};
BudgetsModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Budget, Expense])],
        controllers: [BudgetsController],
        providers: [BudgetsService],
        exports: [BudgetsService],
    })
], BudgetsModule);
export { BudgetsModule };
//# sourceMappingURL=budgets.module.js.map