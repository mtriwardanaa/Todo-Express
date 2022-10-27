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
} from 'typeorm'
import { Project } from '../../project/models/project-model'
import { Task } from './task-model'

@Entity('section')
export class Section extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    project_id!: string

    @Column()
    name!: string

    @Column()
    order!: number

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    //section to task table
    @OneToMany(() => Task, (task) => task.section)
    tasks!: Task

    //section to project table
    @ManyToOne(() => Project, (project) => project.sections, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'project_id',
    })
    project!: Project
}
