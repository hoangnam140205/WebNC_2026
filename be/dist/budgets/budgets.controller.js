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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, } from '@nestjs/common';
import { BudgetsService } from './budgets.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
let BudgetsController = class BudgetsController {
    budgetsService;
    constructor(budgetsService) {
        this.budgetsService = budgetsService;
    }
    create(createBudgetDto, req) {
        return this.budgetsService.create(createBudgetDto, req.user.id);
    }
    findAll(req) {
        return this.budgetsService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.budgetsService.findOne(id, req.user.id);
    }
    update(id, updateDto, req) {
        return this.budgetsService.update(id, updateDto, req.user.id);
    }
    remove(id, req) {
        return this.budgetsService.remove(id, req.user.id);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBudgetDto, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "remove", null);
BudgetsController = __decorate([
    Controller('budgets'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [BudgetsService])
], BudgetsController);
export { BudgetsController };
//# sourceMappingURL=budgets.controller.js.map