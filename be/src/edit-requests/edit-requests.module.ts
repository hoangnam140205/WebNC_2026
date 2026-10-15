import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditRequestsService } from './edit-requests.service.js';
import { EditRequestsController } from './edit-requests.controller.js';
import { EditRequest } from './entities/edit-request.entity.js';
import { Expense } from '../expenses/entities/expense.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([EditRequest, Expense])],
  controllers: [EditRequestsController],
  providers: [EditRequestsService],
  exports: [EditRequestsService],
})
export class EditRequestsModule {}
