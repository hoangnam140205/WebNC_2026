import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(userId: string) {
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

  async findOne(id: string, userId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    return category;
  }

  async update(id: string, updateDto: Partial<CreateCategoryDto>, userId: string) {
    const category = await this.findOne(id, userId);
    Object.assign(category, updateDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string, userId: string) {
    const category = await this.findOne(id, userId);
    return this.categoriesRepository.remove(category);
  }

  async seedDefaults(userId: string) {
    const existing = await this.categoriesRepository.count({ where: { userId } });
    if (existing > 0) return;

    const defaults = [
      { name: 'Ăn uống', icon: '🍜', color: '#ef4444', type: 'expense' as const },
      { name: 'Di chuyển', icon: '🚗', color: '#f97316', type: 'expense' as const },
      { name: 'Mua sắm', icon: '🛒', color: '#eab308', type: 'expense' as const },
      { name: 'Giải trí', icon: '🎮', color: '#22c55e', type: 'expense' as const },
      { name: 'Sức khỏe', icon: '💊', color: '#06b6d4', type: 'expense' as const },
      { name: 'Giáo dục', icon: '📚', color: '#8b5cf6', type: 'expense' as const },
      { name: 'Hóa đơn', icon: '📄', color: '#ec4899', type: 'expense' as const },
      { name: 'Khác', icon: '📦', color: '#6b7280', type: 'expense' as const },
      { name: 'Lương', icon: '💰', color: '#10b981', type: 'income' as const },
      { name: 'Thưởng', icon: '🎁', color: '#f59e0b', type: 'income' as const },
      { name: 'Đầu tư', icon: '📈', color: '#3b82f6', type: 'income' as const },
      { name: 'Thu nhập khác', icon: '💵', color: '#14b8a6', type: 'income' as const },
    ];

    const categories = defaults.map((d) =>
      this.categoriesRepository.create({ ...d, userId }),
    );
    await this.categoriesRepository.save(categories);
  }
}
