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
let Expense = class Expense {
    id;
    amount;
    description;
    note;
    date;
    type;
    category;
    categoryId;
    user;
    userId;
    editRequests;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Expense.prototype, "id", void 0);
__decorate([
    Column({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    Column({ length: 255 }),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "note", void 0);
__decorate([
    Column({ type: 'date' }),
    __metadata("design:type", String)
], Expense.prototype, "date", void 0);
__decorate([
    Column({ type: 'enum', enum: ['income', 'expense'], default: 'expense' }),
    __metadata("design:type", String)
], Expense.prototype, "type", void 0);
__decorate([
    ManyToOne('Category', 'expenses', {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    __metadata("design:type", Function)
], Expense.prototype, "category", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "categoryId", void 0);
__decorate([
    ManyToOne('User', 'expenses', { onDelete: 'CASCADE' }),
    __metadata("design:type", Function)
], Expense.prototype, "user", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Expense.prototype, "userId", void 0);
__decorate([
    OneToMany('EditRequest', 'expense'),
    __metadata("design:type", Array)
], Expense.prototype, "editRequests", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Expense.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Expense.prototype, "updatedAt", void 0);
Expense = __decorate([
    Entity('expenses')
], Expense);
export { Expense };
//# sourceMappingURL=expense.entity.js.map