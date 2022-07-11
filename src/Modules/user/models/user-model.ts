import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from '../../project/models/project-model';
import { Task } from '../../task/models/task-model';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({
    default: true,
    name: 'active',
  })
  is_active!: boolean;

  @OneToMany(() => Task, (task) => task.section)
  tasks!: Task;

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
