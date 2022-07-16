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

  @Column({
    nullable: true,
  })
  parent_id!: string;

  @Column()
  project_id!: string;

  @Column({
    nullable: true,
  })
  section_id!: string;

  @Column({
    nullable: true,
  })
  user_id!: string;

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

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  //task to project table
  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'project_id',
  })
  project!: Project;

  //subtask to task parent table
  @ManyToOne(() => Task, (parent) => parent.subtasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent!: Task;

  //task parent to subtask table
  @OneToMany(() => Task, (subtask) => subtask.parent)
  subtasks!: Task;

  //task to section table
  @ManyToOne(() => Section, (section) => section.tasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'section_id',
  })
  section!: Section;

  //task to user table, sementara belum di pakai
  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  //task to comment table
  @OneToMany(() => Comment, (comment) => comment.task)
  comments!: Comment;
}
