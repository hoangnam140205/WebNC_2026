import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Expense } from '../../expenses/entities/expense.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

@Entity('edit_requests')
export class EditRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Expense', 'editRequests', { onDelete: 'CASCADE' })
  expense: Expense;

  @Column()
  expenseId: string;

  @ManyToOne('User', 'editRequests', { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  requestedAmount: number;

  @Column({ length: 255 })
  requestedDescription: string;

  @Column({ type: 'text', nullable: true })
  requestedNote: string;

  @Column({ type: 'date' })
  requestedDate: string;

  @Column({ type: 'enum', enum: ['income', 'expense'], default: 'expense' })
  requestedType: 'income' | 'expense';

  @ManyToOne('Category', { nullable: true, onDelete: 'SET NULL' })
  requestedCategory: Category;

  @Column({ nullable: true })
  requestedCategoryId: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: RequestStatus;

  @Column({ type: 'text', nullable: true })
  adminNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
