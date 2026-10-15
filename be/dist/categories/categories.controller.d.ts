import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, req: any): Promise<import("./entities/category.entity.js").Category>;
    findAll(req: any): Promise<import("./entities/category.entity.js").Category[]>;
    findOne(id: string, req: any): Promise<import("./entities/category.entity.js").Category>;
    update(id: string, updateDto: Partial<CreateCategoryDto>, req: any): Promise<import("./entities/category.entity.js").Category>;
    remove(id: string, req: any): Promise<import("./entities/category.entity.js").Category>;
}
