import { EditRequestsService } from './edit-requests.service.js';
import { CreateEditRequestDto } from './dto/create-edit-request.dto.js';
import { ReviewEditRequestDto } from './dto/review-edit-request.dto.js';
export declare class EditRequestsController {
    private readonly editRequestsService;
    constructor(editRequestsService: EditRequestsService);
    create(createDto: CreateEditRequestDto, req: any): Promise<import("./entities/edit-request.entity.js").EditRequest>;
    findMyRequests(req: any): Promise<import("./entities/edit-request.entity.js").EditRequest[]>;
    findAllAdmin(status?: 'pending' | 'approved' | 'rejected'): Promise<import("./entities/edit-request.entity.js").EditRequest[]>;
    findOne(id: string): Promise<import("./entities/edit-request.entity.js").EditRequest>;
    approve(id: string, reviewDto: ReviewEditRequestDto): Promise<import("./entities/edit-request.entity.js").EditRequest>;
    reject(id: string, reviewDto: ReviewEditRequestDto): Promise<import("./entities/edit-request.entity.js").EditRequest>;
}
