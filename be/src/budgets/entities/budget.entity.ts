import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  spent: number;

  @Column({ type: 'enum', enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' })
  period: 'monthly' | 'weekly' | 'yearly';

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @ManyToOne('Category', { onDelete: 'SET NULL', nullable: true })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne('User', 'budgets', { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
