var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity.js';
import { Expense } from '../expenses/entities/expense.entity.js';
let BudgetsService = class BudgetsService {
    budgetsRepository;
    expensesRepository;
    constructor(budgetsRepository, expensesRepository) {
        this.budgetsRepository = budgetsRepository;
        this.expensesRepository = expensesRepository;
    }
    async create(createBudgetDto, userId) {
        const budget = this.budgetsRepository.create({
            ...createBudgetDto,
            userId,
        });
        return this.budgetsRepository.save(budget);
    }
    async findAll(userId) {
        const budgets = await this.budgetsRepository.find({
            where: { userId },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
        const enriched = await Promise.all(budgets.map(async (budget) => {
            const qb = this.expensesRepository
                .createQueryBuilder('expense')
                .select('SUM(expense.amount)', 'spent')
                .where('expense.userId = :userId', { userId })
                .andWhere('expense.type = :type', { type: 'expense' })
                .andWhere('expense.date BETWEEN :startDate AND :endDate', {
                startDate: budget.startDate,
                endDate: budget.endDate,
            });
            if (budget.categoryId) {
                qb.andWhere('expense.categoryId = :categoryId', {
                    categoryId: budget.categoryId,
                });
            }
            const result = await qb.getRawOne();
            const spent = Number(result?.spent || 0);
            return {
                ...budget,
                spent,
                remaining: Number(budget.amount) - spent,
                percentage: budget.amount > 0 ? Math.round((spent / Number(budget.amount)) * 100) : 0,
            };
        }));
        return enriched;
    }
    async findOne(id, userId) {
        const budget = await this.budgetsRepository.findOne({
            where: { id, userId },
            relations: ['category'],
        });
        if (!budget) {
            throw new NotFoundException('Ngân sách không tồn tại');
        }
        return budget;
    }
    async update(id, updateDto, userId) {
        const budget = await this.findOne(id, userId);
        Object.assign(budget, updateDto);
        return this.budgetsRepository.save(budget);
    }
    async remove(id, userId) {
        const budget = await this.findOne(id, userId);
        return this.budgetsRepository.remove(budget);
    }
};
BudgetsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Budget)),
    __param(1, InjectRepository(Expense)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], BudgetsService);
export { BudgetsService };
//# sourceMappingURL=budgets.service.js.map