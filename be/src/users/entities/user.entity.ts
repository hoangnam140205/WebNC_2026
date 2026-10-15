import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Expense } from '../../expenses/entities/expense.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';
import type { Budget } from '../../budgets/entities/budget.entity.js';
import type { EditRequest } from '../../edit-requests/entities/edit-request.entity.js';

export type UserRole = 'admin' | 'user';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 3, default: 'VND' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Expense', 'user')
  expenses: Expense[];

  @OneToMany('Category', 'user')
  categories: Category[];

  @OneToMany('Budget', 'user')
  budgets: Budget[];

  @OneToMany('EditRequest', 'user')
  editRequests: EditRequest[];
}
