var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditRequestsService } from './edit-requests.service.js';
import { EditRequestsController } from './edit-requests.controller.js';
import { EditRequest } from './entities/edit-request.entity.js';
import { Expense } from '../expenses/entities/expense.entity.js';
let EditRequestsModule = class EditRequestsModule {
};
EditRequestsModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([EditRequest, Expense])],
        controllers: [EditRequestsController],
        providers: [EditRequestsService],
        exports: [EditRequestsService],
    })
], EditRequestsModule);
export { EditRequestsModule };
//# sourceMappingURL=edit-requests.module.js.map