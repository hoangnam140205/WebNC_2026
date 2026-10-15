var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, } from 'typeorm';
let Budget = class Budget {
    id;
    name;
    amount;
    spent;
    period;
    startDate;
    endDate;
    category;
    categoryId;
    user;
    userId;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Budget.prototype, "id", void 0);
__decorate([
    Column({ length: 100 }),
    __metadata("design:type", String)
], Budget.prototype, "name", void 0);
__decorate([
    Column({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Budget.prototype, "amount", void 0);
__decorate([
    Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Budget.prototype, "spent", void 0);
__decorate([
    Column({ type: 'enum', enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' }),
    __metadata("design:type", String)
], Budget.prototype, "period", void 0);
__decorate([
    Column({ type: 'date' }),
    __metadata("design:type", String)
], Budget.prototype, "startDate", void 0);
__decorate([
    Column({ type: 'date' }),
    __metadata("design:type", String)
], Budget.prototype, "endDate", void 0);
__decorate([
    ManyToOne('Category', { onDelete: 'SET NULL', nullable: true }),
    __metadata("design:type", Function)
], Budget.prototype, "category", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Budget.prototype, "categoryId", void 0);
__decorate([
    ManyToOne('User', 'budgets', { onDelete: 'CASCADE' }),
    __metadata("design:type", Function)
], Budget.prototype, "user", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Budget.prototype, "userId", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Budget.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Budget.prototype, "updatedAt", void 0);
Budget = __decorate([
    Entity('budgets')
], Budget);
export { Budget };
//# sourceMappingURL=budget.entity.js.map