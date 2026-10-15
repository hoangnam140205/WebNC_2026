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
import type { Category } from '../../categories/entities/category.entity.js';
import type { EditRequest } from '../../edit-requests/entities/edit-request.entity.js';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: ['income', 'expense'], default: 'expense' })
  type: 'income' | 'expense';

  @ManyToOne('Category', 'expenses', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne('User', 'expenses', { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @OneToMany('EditRequest', 'expense')
  editRequests: EditRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
