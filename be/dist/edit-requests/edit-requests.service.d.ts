import { Repository } from 'typeorm';
import { EditRequest } from './entities/edit-request.entity.js';
import { Expense } from '../expenses/entities/expense.entity.js';
import { CreateEditRequestDto } from './dto/create-edit-request.dto.js';
import { ReviewEditRequestDto } from './dto/review-edit-request.dto.js';
export declare class EditRequestsService {
    private editRequestsRepository;
    private expensesRepository;
    constructor(editRequestsRepository: Repository<EditRequest>, expensesRepository: Repository<Expense>);
    create(createDto: CreateEditRequestDto, userId: string): Promise<EditRequest>;
    findMyRequests(userId: string): Promise<EditRequest[]>;
    findAllAdmin(status?: 'pending' | 'approved' | 'rejected'): Promise<EditRequest[]>;
    findOne(id: string): Promise<EditRequest>;
    approve(id: string, reviewDto: ReviewEditRequestDto): Promise<EditRequest>;
    reject(id: string, reviewDto: ReviewEditRequestDto): Promise<EditRequest>;
}
