import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditRequest } from './entities/edit-request.entity.js';
import { Expense } from '../expenses/entities/expense.entity.js';
import { CreateEditRequestDto } from './dto/create-edit-request.dto.js';
import { ReviewEditRequestDto } from './dto/review-edit-request.dto.js';

@Injectable()
export class EditRequestsService {
  constructor(
    @InjectRepository(EditRequest)
    private editRequestsRepository: Repository<EditRequest>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createDto: CreateEditRequestDto, userId: string) {
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

    // Check if there is already a pending request for this expense
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

  async findMyRequests(userId: string) {
    return this.editRequestsRepository.find({
      where: { userId },
      relations: ['expense', 'requestedCategory'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllAdmin(status?: 'pending' | 'approved' | 'rejected') {
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

  async findOne(id: string) {
    const request = await this.editRequestsRepository.findOne({
      where: { id },
      relations: ['user', 'expense', 'requestedCategory'],
    });
    if (!request) {
      throw new NotFoundException('Không tìm thấy yêu cầu chỉnh sửa');
    }
    return request;
  }

  async approve(id: string, reviewDto: ReviewEditRequestDto) {
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

    // Update the actual expense
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

  async reject(id: string, reviewDto: ReviewEditRequestDto) {
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
}
