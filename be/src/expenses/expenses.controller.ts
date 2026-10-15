import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // ============ ADMIN ENDPOINTS (Phải đặt trước ':id' route) ============
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllAdmin(
    @Query('userId') userId?: string,
    @Query('keyword') keyword?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: 'income' | 'expense',
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.expensesService.findAllAdmin({
      userId,
      keyword,
      startDate,
      endDate,
      type,
      categoryId,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAdminStats() {
    return this.expensesService.getAdminStats();
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  adminDelete(@Param('id') id: string) {
    return this.expensesService.adminDelete(id);
  }

  // ============ USER ENDPOINTS ============
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req: any) {
    return this.expensesService.create(createExpenseDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('keyword') keyword?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: 'income' | 'expense',
    @Query('categoryId') categoryId?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.expensesService.findAll(req.user.id, {
      keyword,
      startDate,
      endDate,
      type,
      categoryId,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('statistics')
  getStatistics(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.getStatistics(req.user.id, startDate, endDate);
  }

  @Get('monthly-report')
  getMonthlyReport(
    @Request() req: any,
    @Query('year') year?: string,
  ) {
    return this.expensesService.getMonthlyReport(
      req.user.id,
      year ? parseInt(year) : new Date().getFullYear(),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateExpenseDto>,
    @Request() req: any,
  ) {
    return this.expensesService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.remove(id, req.user.id);
  }
}
