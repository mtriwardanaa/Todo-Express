import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Task } from '../../task/models/task-model';

@Entity('project')
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column({
    default: false,
  })
  favorite!: boolean;

  @Column({
    default: false,
  })
  archived!: boolean;

  @Column()
  order!: number;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
