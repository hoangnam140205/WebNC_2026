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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, } from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    findAllAdmin(userId, keyword, startDate, endDate, type, categoryId, page, limit) {
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
    getAdminStats() {
        return this.expensesService.getAdminStats();
    }
    adminDelete(id) {
        return this.expensesService.adminDelete(id);
    }
    create(createExpenseDto, req) {
        return this.expensesService.create(createExpenseDto, req.user.id);
    }
    findAll(req, keyword, startDate, endDate, type, categoryId, minAmount, maxAmount, page, limit) {
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
    getStatistics(req, startDate, endDate) {
        return this.expensesService.getStatistics(req.user.id, startDate, endDate);
    }
    getMonthlyReport(req, year) {
        return this.expensesService.getMonthlyReport(req.user.id, year ? parseInt(year) : new Date().getFullYear());
    }
    findOne(id, req) {
        return this.expensesService.findOne(id, req.user.id);
    }
    update(id, updateDto, req) {
        return this.expensesService.update(id, updateDto, req.user.id);
    }
    remove(id, req) {
        return this.expensesService.remove(id, req.user.id);
    }
};
__decorate([
    Get('admin/all'),
    UseGuards(RolesGuard),
    Roles('admin'),
    __param(0, Query('userId')),
    __param(1, Query('keyword')),
    __param(2, Query('startDate')),
    __param(3, Query('endDate')),
    __param(4, Query('type')),
    __param(5, Query('categoryId')),
    __param(6, Query('page')),
    __param(7, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAllAdmin", null);
__decorate([
    Get('admin/stats'),
    UseGuards(RolesGuard),
    Roles('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getAdminStats", null);
__decorate([
    Delete('admin/:id'),
    UseGuards(RolesGuard),
    Roles('admin'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "adminDelete", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Request()),
    __param(1, Query('keyword')),
    __param(2, Query('startDate')),
    __param(3, Query('endDate')),
    __param(4, Query('type')),
    __param(5, Query('categoryId')),
    __param(6, Query('minAmount')),
    __param(7, Query('maxAmount')),
    __param(8, Query('page')),
    __param(9, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
__decorate([
    Get('statistics'),
    __param(0, Request()),
    __param(1, Query('startDate')),
    __param(2, Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getStatistics", null);
__decorate([
    Get('monthly-report'),
    __param(0, Request()),
    __param(1, Query('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getMonthlyReport", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "remove", null);
ExpensesController = __decorate([
    Controller('expenses'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [ExpensesService])
], ExpensesController);
export { ExpensesController };
//# sourceMappingURL=expenses.controller.js.map