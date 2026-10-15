import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    create(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category>;
    findAll(userId: string): Promise<Category[]>;
    findOne(id: string, userId: string): Promise<Category>;
    update(id: string, updateDto: Partial<CreateCategoryDto>, userId: string): Promise<Category>;
    remove(id: string, userId: string): Promise<Category>;
    seedDefaults(userId: string): Promise<void>;
}
