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
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditRequest } from './entities/edit-request.entity.js';
import { Expense } from '../expenses/entities/expense.entity.js';
let EditRequestsService = class EditRequestsService {
    editRequestsRepository;
    expensesRepository;
    constructor(editRequestsRepository, expensesRepository) {
        this.editRequestsRepository = editRequestsRepository;
        this.expensesRepository = expensesRepository;
    }
    async create(createDto, userId) {
        const expense = await this.expensesRepository.findOne({
            where: { id: createDto.expenseId },
            relations: ['category'],
        });
        if (!expense) {
            throw new NotFoundException('Không tìm thấy khoản chi tiêu');
        }
        if (expense.userId !== userId) {
            throw new ForbiddenException('Bạn chỉ có thể gửi yêu cầu chỉnh sửa khoản chi tiêu của chính mình');
        }
        const existingPending = await this.editRequestsRepository.findOne({
            where: { expenseId: expense.id, status: 'pending' },
        });
        if (existingPending) {
            throw new BadRequestException('Khoản chi tiêu này đã có yêu cầu chỉnh sửa đang chờ duyệt');
        }
        const editRequest = this.editRequestsRepository.create({
            ...createDto,
            userId,
            status: 'pending',
            requestedType: createDto.requestedType || expense.type,
            requestedCategoryId: createDto.requestedCategoryId || expense.categoryId,
        });
        return this.editRequestsRepository.save(editRequest);
    }
    async findMyRequests(userId) {
        return this.editRequestsRepository.find({
            where: { userId },
            relations: ['expense', 'requestedCategory'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllAdmin(status) {
        const query = this.editRequestsRepository
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.user', 'user')
            .leftJoinAndSelect('request.expense', 'expense')
            .leftJoinAndSelect('request.requestedCategory', 'category')
            .orderBy('request.createdAt', 'DESC');
        if (status) {
            query.where('request.status = :status', { status });
        }
        return query.getMany();
    }
    async findOne(id) {
        const request = await this.editRequestsRepository.findOne({
            where: { id },
            relations: ['user', 'expense', 'requestedCategory'],
        });
        if (!request) {
            throw new NotFoundException('Không tìm thấy yêu cầu chỉnh sửa');
        }
        return request;
    }
    async approve(id, reviewDto) {
        const request = await this.editRequestsRepository.findOne({
            where: { id },
            relations: ['expense'],
        });
        if (!request) {
            throw new NotFoundException('Không tìm thấy yêu cầu chỉnh sửa');
        }
        if (request.status !== 'pending') {
            throw new BadRequestException('Yêu cầu này đã được xử lý trước đó');
        }
        const expense = await this.expensesRepository.findOne({ where: { id: request.expenseId } });
        if (expense) {
            expense.amount = request.requestedAmount;
            expense.description = request.requestedDescription;
            expense.date = request.requestedDate;
            expense.type = request.requestedType;
            expense.note = request.requestedNote;
            if (request.requestedCategoryId) {
                expense.categoryId = request.requestedCategoryId;
            }
            await this.expensesRepository.save(expense);
        }
        request.status = 'approved';
        request.adminNote = reviewDto.adminNote || 'Yêu cầu chỉnh sửa đã được quản trị viên duyệt và áp dụng';
        return this.editRequestsRepository.save(request);
    }
    async reject(id, reviewDto) {
        const request = await this.editRequestsRepository.findOne({ where: { id } });
        if (!request) {
            throw new NotFoundException('Không tìm thấy yêu cầu chỉnh sửa');
        }
        if (request.status !== 'pending') {
            throw new BadRequestException('Yêu cầu này đã được xử lý trước đó');
        }
        request.status = 'rejected';
        request.adminNote = reviewDto.adminNote || 'Yêu cầu chỉnh sửa đã bị từ chối';
        return this.editRequestsRepository.save(request);
    }
};
EditRequestsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(EditRequest)),
    __param(1, InjectRepository(Expense)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], EditRequestsService);
export { EditRequestsService };
//# sourceMappingURL=edit-requests.service.js.map