import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../../task/models/task-model';
import { User } from '../../user/models/user-model';

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

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
