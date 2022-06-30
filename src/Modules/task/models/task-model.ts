import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from '../../comment/models/comment-model';
import { Project } from '../../project/models/project-model';
import { User } from '../../user/models/user-model';
import { Section } from './section-model';

export type Priority = 1 | 2 | 3 | 4;

@Entity('task')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'project_id',
  })
  project!: Project;

  @ManyToOne(() => Task, (parent) => parent.subtasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent!: Task;

  @OneToMany(() => Task, (subtask) => subtask.parent)
  subtasks!: Task;

  @ManyToOne(() => Section, (section) => section.tasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'section_id',
  })
  section!: Section;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @Column()
  name!: string;

  @Column()
  desc!: string;

  @Column()
  due_date!: Date;

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4],
    default: 4,
  })
  priority!: Priority;

  @Column({
    default: false,
  })
  compeleted!: boolean;

  @Column()
  order!: number;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments!: Comment;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
