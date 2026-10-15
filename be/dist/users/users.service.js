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
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity.js';
import { CategoriesService } from '../categories/categories.service.js';
let UsersService = class UsersService {
    usersRepository;
    categoriesService;
    constructor(usersRepository, categoriesService) {
        this.usersRepository = usersRepository;
        this.categoriesService = categoriesService;
    }
    async findAll() {
        const users = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.expenses', 'expense')
            .select([
            'user.id',
            'user.fullName',
            'user.email',
            'user.role',
            'user.isActive',
            'user.currency',
            'user.createdAt',
            'user.updatedAt',
        ])
            .loadRelationCountAndMap('user.expenseCount', 'user.expenses')
            .orderBy('user.createdAt', 'DESC')
            .getMany();
        return users;
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['expenses', 'categories'],
        });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }
        const { password, ...result } = user;
        return result;
    }
    async create(createUserDto) {
        const existing = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (existing) {
            throw new ConflictException('Email này đã được sử dụng');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
            role: createUserDto.role || 'user',
            isActive: true,
            currency: createUserDto.currency || 'VND',
        });
        const saved = await this.usersRepository.save(user);
        await this.categoriesService.seedDefaults(saved.id);
        const { password, ...result } = saved;
        return result;
    }
    async update(id, updateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const emailExists = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
            if (emailExists) {
                throw new ConflictException('Email này đã được sử dụng');
            }
            user.email = updateUserDto.email;
        }
        if (updateUserDto.fullName) {
            user.fullName = updateUserDto.fullName;
        }
        if (updateUserDto.role) {
            user.role = updateUserDto.role;
        }
        if (updateUserDto.isActive !== undefined) {
            user.isActive = updateUserDto.isActive;
        }
        if (updateUserDto.currency) {
            user.currency = updateUserDto.currency;
        }
        if (updateUserDto.password) {
            user.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const updated = await this.usersRepository.save(user);
        const { password, ...result } = updated;
        return result;
    }
    async toggleActive(id, currentUserId) {
        if (id === currentUserId) {
            throw new BadRequestException('Bạn không thể khóa tài khoản của chính mình');
        }
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }
        user.isActive = !user.isActive;
        const updated = await this.usersRepository.save(user);
        const { password, ...result } = updated;
        return result;
    }
    async remove(id, currentUserId) {
        if (id === currentUserId) {
            throw new BadRequestException('Bạn không thể xóa tài khoản của chính mình');
        }
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }
        await this.usersRepository.remove(user);
        return { message: 'Đã xóa người dùng thành công' };
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [Repository,
        CategoriesService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map