import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EditRequestsService } from './edit-requests.service.js';
import { CreateEditRequestDto } from './dto/create-edit-request.dto.js';
import { ReviewEditRequestDto } from './dto/review-edit-request.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('edit-requests')
@UseGuards(JwtAuthGuard)
export class EditRequestsController {
  constructor(private readonly editRequestsService: EditRequestsService) {}

  // User: Tạo yêu cầu chỉnh sửa chi tiêu
  @Post()
  create(@Body() createDto: CreateEditRequestDto, @Request() req: any) {
    return this.editRequestsService.create(createDto, req.user.id);
  }

  // User: Xem danh sách yêu cầu của bản thân
  @Get('my')
  findMyRequests(@Request() req: any) {
    return this.editRequestsService.findMyRequests(req.user.id);
  }

  // Admin: Xem tất cả yêu cầu chỉnh sửa
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllAdmin(@Query('status') status?: 'pending' | 'approved' | 'rejected') {
    return this.editRequestsService.findAllAdmin(status);
  }

  // Admin: Xem chi tiết yêu cầu
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.editRequestsService.findOne(id);
  }

  // Admin: Duyệt yêu cầu chỉnh sửa
  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin')
  approve(@Param('id') id: string, @Body() reviewDto: ReviewEditRequestDto) {
    return this.editRequestsService.approve(id, reviewDto);
  }

  // Admin: Từ chối yêu cầu chỉnh sửa
  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin')
  reject(@Param('id') id: string, @Body() reviewDto: ReviewEditRequestDto) {
    return this.editRequestsService.reject(id, reviewDto);
  }
}
