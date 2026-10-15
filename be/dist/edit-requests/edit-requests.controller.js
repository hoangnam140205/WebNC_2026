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
import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request, } from '@nestjs/common';
import { EditRequestsService } from './edit-requests.service.js';
import { CreateEditRequestDto } from './dto/create-edit-request.dto.js';
import { ReviewEditRequestDto } from './dto/review-edit-request.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
let EditRequestsController = class EditRequestsController {
    editRequestsService;
    constructor(editRequestsService) {
        this.editRequestsService = editRequestsService;
    }
    create(createDto, req) {
        return this.editRequestsService.create(createDto, req.user.id);
    }
    findMyRequests(req) {
        return this.editRequestsService.findMyRequests(req.user.id);
    }
    findAllAdmin(status) {
        return this.editRequestsService.findAllAdmin(status);
    }
    findOne(id) {
        return this.editRequestsService.findOne(id);
    }
    approve(id, reviewDto) {
        return this.editRequestsService.approve(id, reviewDto);
    }
    reject(id, reviewDto) {
        return this.editRequestsService.reject(id, reviewDto);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEditRequestDto, Object]),
    __metadata("design:returntype", void 0)
], EditRequestsController.prototype, "create", null);
__decorate([
    Get('my'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EditRequestsController.prototype, "findMyRequests", null);
__decorate([
    Get(),
    UseGuards(RolesGuard),
    Roles('admin'),
    __param(0, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EditRequestsController.prototype, "findAllAdmin", null);
__decorate([
    Get(':id'),
    UseGuards(RolesGuard),
    Roles('admin'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EditRequestsController.prototype, "findOne", null);
__decorate([
    Patch(':id/approve'),
    UseGuards(RolesGuard),
    Roles('admin'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReviewEditRequestDto]),
    __metadata("design:returntype", void 0)
], EditRequestsController.prototype, "approve", null);
__decorate([
    Patch(':id/reject'),
    UseGuards(RolesGuard),
    Roles('admin'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReviewEditRequestDto]),
    __metadata("design:returntype", void 0)
], EditRequestsController.prototype, "reject", null);
EditRequestsController = __decorate([
    Controller('edit-requests'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [EditRequestsService])
], EditRequestsController);
export { EditRequestsController };
//# sourceMappingURL=edit-requests.controller.js.map