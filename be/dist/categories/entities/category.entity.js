var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, } from 'typeorm';
let Category = class Category {
    id;
    name;
    icon;
    color;
    type;
    user;
    userId;
    expenses;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    Column({ length: 100 }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    Column({ length: 50 }),
    __metadata("design:type", String)
], Category.prototype, "icon", void 0);
__decorate([
    Column({ length: 7, default: '#6366f1' }),
    __metadata("design:type", String)
], Category.prototype, "color", void 0);
__decorate([
    Column({ type: 'enum', enum: ['income', 'expense'], default: 'expense' }),
    __metadata("design:type", String)
], Category.prototype, "type", void 0);
__decorate([
    ManyToOne('User', 'categories', { onDelete: 'CASCADE' }),
    __metadata("design:type", Function)
], Category.prototype, "user", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Category.prototype, "userId", void 0);
__decorate([
    OneToMany('Expense', 'category'),
    __metadata("design:type", Array)
], Category.prototype, "expenses", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
Category = __decorate([
    Entity('categories')
], Category);
export { Category };
//# sourceMappingURL=category.entity.js.map