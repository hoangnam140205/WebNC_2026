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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
let CategoriesService = class CategoriesService {
    categoriesRepository;
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async create(createCategoryDto, userId) {
        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            userId,
        });
        return this.categoriesRepository.save(category);
    }
    async findAll(userId) {
        let categories = await this.categoriesRepository.find({
            where: { userId },
            order: { name: 'ASC' },
        });
        if (categories.length === 0) {
            await this.seedDefaults(userId);
            categories = await this.categoriesRepository.find({
                where: { userId },
                order: { name: 'ASC' },
            });
        }
        return categories;
    }
    async findOne(id, userId) {
        const category = await this.categoriesRepository.findOne({
            where: { id, userId },
        });
        if (!category) {
            throw new NotFoundException('Danh mục không tồn tại');
        }
        return category;
    }
    async update(id, updateDto, userId) {
        const category = await this.findOne(id, userId);
        Object.assign(category, updateDto);
        return this.categoriesRepository.save(category);
    }
    async remove(id, userId) {
        const category = await this.findOne(id, userId);
        return this.categoriesRepository.remove(category);
    }
    async seedDefaults(userId) {
        const existing = await this.categoriesRepository.count({ where: { userId } });
        if (existing > 0)
            return;
        const defaults = [
            { name: 'Ăn uống', icon: '🍜', color: '#ef4444', type: 'expense' },
            { name: 'Di chuyển', icon: '🚗', color: '#f97316', type: 'expense' },
            { name: 'Mua sắm', icon: '🛒', color: '#eab308', type: 'expense' },
            { name: 'Giải trí', icon: '🎮', color: '#22c55e', type: 'expense' },
            { name: 'Sức khỏe', icon: '💊', color: '#06b6d4', type: 'expense' },
            { name: 'Giáo dục', icon: '📚', color: '#8b5cf6', type: 'expense' },
            { name: 'Hóa đơn', icon: '📄', color: '#ec4899', type: 'expense' },
            { name: 'Khác', icon: '📦', color: '#6b7280', type: 'expense' },
            { name: 'Lương', icon: '💰', color: '#10b981', type: 'income' },
            { name: 'Thưởng', icon: '🎁', color: '#f59e0b', type: 'income' },
            { name: 'Đầu tư', icon: '📈', color: '#3b82f6', type: 'income' },
            { name: 'Thu nhập khác', icon: '💵', color: '#14b8a6', type: 'income' },
        ];
        const categories = defaults.map((d) => this.categoriesRepository.create({ ...d, userId }));
        await this.categoriesRepository.save(categories);
    }
};
CategoriesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Category)),
    __metadata("design:paramtypes", [Repository])
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map