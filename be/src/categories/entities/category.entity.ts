import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Expense } from '../../expenses/entities/expense.entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  icon: string;

  @Column({ length: 7, default: '#6366f1' })
  color: string;

  @Column({ type: 'enum', enum: ['income', 'expense'], default: 'expense' })
  type: 'income' | 'expense';

  @ManyToOne('User', 'categories', { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @OneToMany('Expense', 'category')
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
