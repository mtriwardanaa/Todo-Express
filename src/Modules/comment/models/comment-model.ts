import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../../task/models/task-model';

@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  comment!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  //comment to task table
  @ManyToOne(() => Task, (task) => task.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'task_id',
  })
  task!: Task;
}
