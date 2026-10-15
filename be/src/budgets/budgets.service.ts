import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { Expense } from '../expenses/entities/expense.entity.js';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string) {
    const budget = this.budgetsRepository.create({
      ...createBudgetDto,
      userId,
    });
    return this.budgetsRepository.save(budget);
  }

  async findAll(userId: string) {
    const budgets = await this.budgetsRepository.find({
      where: { userId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });

    // Calculate spent for each budget
    const enriched = await Promise.all(
      budgets.map(async (budget) => {
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
      }),
    );

    return enriched;
  }

  async findOne(id: string, userId: string) {
    const budget = await this.budgetsRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
    if (!budget) {
      throw new NotFoundException('Ngân sách không tồn tại');
    }
    return budget;
  }

  async update(id: string, updateDto: Partial<CreateBudgetDto>, userId: string) {
    const budget = await this.findOne(id, userId);
    Object.assign(budget, updateDto);
    return this.budgetsRepository.save(budget);
  }

  async remove(id: string, userId: string) {
    const budget = await this.findOne(id, userId);
    return this.budgetsRepository.remove(budget);
  }
}
