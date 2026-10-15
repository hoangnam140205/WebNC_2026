import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      userId,
    });
    return this.expensesRepository.save(expense);
  }

  async findAll(
    userId: string,
    query: {
      keyword?: string;
      startDate?: string;
      endDate?: string;
      type?: 'income' | 'expense';
      categoryId?: string;
      minAmount?: number;
      maxAmount?: number;
      page?: number;
      limit?: number;
    },
  ) {
    const { keyword, startDate, endDate, type, categoryId, minAmount, maxAmount, page = 1, limit = 20 } = query;

    const qb = this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.editRequests', 'editRequests')
      .where('expense.userId = :userId', { userId });

    if (keyword) {
      qb.andWhere('(expense.description LIKE :kw OR expense.note LIKE :kw)', { kw: `%${keyword}%` });
    }

    if (startDate && endDate) {
      qb.andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      qb.andWhere('expense.date >= :startDate', { startDate });
    } else if (endDate) {
      qb.andWhere('expense.date <= :endDate', { endDate });
    }

    if (type) {
      qb.andWhere('expense.type = :type', { type });
    }

    if (categoryId) {
      qb.andWhere('expense.categoryId = :categoryId', { categoryId });
    }

    if (minAmount !== undefined) {
      qb.andWhere('expense.amount >= :minAmount', { minAmount });
    }

    if (maxAmount !== undefined) {
      qb.andWhere('expense.amount <= :maxAmount', { maxAmount });
    }

    qb.orderBy('expense.date', 'DESC')
      .addOrderBy('expense.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const expense = await this.expensesRepository.findOne({
      where: { id, userId },
      relations: ['category', 'editRequests'],
    });
    if (!expense) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }
    return expense;
  }

  async update(id: string, updateDto: Partial<CreateExpenseDto>, userId: string) {
    const expense = await this.findOne(id, userId);
    Object.assign(expense, updateDto);
    return this.expensesRepository.save(expense);
  }

  async remove(id: string, userId: string) {
    const expense = await this.findOne(id, userId);
    return this.expensesRepository.remove(expense);
  }

  async getStatistics(userId: string, startDate?: string, endDate?: string) {
    const qbTotals = this.expensesRepository
      .createQueryBuilder('expense')
      .select('expense.type', 'type')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId });

    if (startDate && endDate) {
      qbTotals.andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const totals = await qbTotals.groupBy('expense.type').getRawMany();

    const qbCategory = this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('category.icon', 'categoryIcon')
      .addSelect('category.color', 'categoryColor')
      .addSelect('expense.type', 'type')
      .addSelect('SUM(expense.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('expense.userId = :userId', { userId });

    if (startDate && endDate) {
      qbCategory.andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const byCategory = await qbCategory
      .groupBy('expense.categoryId')
      .addGroupBy('expense.type')
      .addGroupBy('category.name')
      .addGroupBy('category.icon')
      .addGroupBy('category.color')
      .getRawMany();

    const totalIncome = totals.find((t: any) => t.type === 'income')?.total || 0;
    const totalExpense = totals.find((t: any) => t.type === 'expense')?.total || 0;

    return {
      totalIncome: Number(totalIncome),
      totalExpense: Number(totalExpense),
      balance: Number(totalIncome) - Number(totalExpense),
      byCategory: byCategory.map((c: any) => ({
        ...c,
        total: Number(c.total),
        count: Number(c.count),
      })),
    };
  }

  async getMonthlyReport(userId: string, year: number) {
    const monthlyData = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('MONTH(expense.date)', 'month')
      .addSelect('expense.type', 'type')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('YEAR(expense.date) = :year', { year })
      .groupBy('MONTH(expense.date)')
      .addGroupBy('expense.type')
      .orderBy('MONTH(expense.date)', 'ASC')
      .getRawMany();

    const months = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const income = monthlyData.find(
        (d: any) => Number(d.month) === month && d.type === 'income',
      );
      const expense = monthlyData.find(
        (d: any) => Number(d.month) === month && d.type === 'expense',
      );
      return {
        month,
        income: income ? Number(income.total) : 0,
        expense: expense ? Number(expense.total) : 0,
      };
    });

    return months;
  }

  // ============ ADMIN METHODS ============
  async findAllAdmin(query: {
    userId?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
    categoryId?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, keyword, startDate, endDate, type, categoryId, page = 1, limit = 20 } = query;

    const qb = this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.user', 'user')
      .leftJoinAndSelect('expense.category', 'category')
      .select([
        'expense',
        'user.id',
        'user.fullName',
        'user.email',
        'category',
      ]);

    if (userId) {
      qb.andWhere('expense.userId = :userId', { userId });
    }

    if (keyword) {
      qb.andWhere('(expense.description LIKE :kw OR expense.note LIKE :kw OR user.fullName LIKE :kw OR user.email LIKE :kw)', {
        kw: `%${keyword}%`,
      });
    }

    if (startDate && endDate) {
      qb.andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    if (type) {
      qb.andWhere('expense.type = :type', { type });
    }

    if (categoryId) {
      qb.andWhere('expense.categoryId = :categoryId', { categoryId });
    }

    qb.orderBy('expense.date', 'DESC')
      .addOrderBy('expense.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminStats() {
    const totals = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('expense.type', 'type')
      .addSelect('SUM(expense.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .groupBy('expense.type')
      .getRawMany();

    const totalIncome = totals.find((t: any) => t.type === 'income')?.total || 0;
    const totalExpense = totals.find((t: any) => t.type === 'expense')?.total || 0;
    const incomeCount = totals.find((t: any) => t.type === 'income')?.count || 0;
    const expenseCount = totals.find((t: any) => t.type === 'expense')?.count || 0;

    return {
      totalIncome: Number(totalIncome),
      totalExpense: Number(totalExpense),
      totalTransactions: Number(incomeCount) + Number(expenseCount),
      balance: Number(totalIncome) - Number(totalExpense),
    };
  }

  async adminDelete(id: string) {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException('Không tìm thấy khoản chi tiêu');
    }
    await this.expensesRepository.remove(expense);
    return { message: 'Đã xóa chi tiêu thành công' };
  }
}
