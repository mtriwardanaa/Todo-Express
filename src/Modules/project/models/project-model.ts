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
import { Section } from '../../task/models/section-model'
import { Task } from '../../task/models/task-model'
import { User } from '../../user/models/user-model'

@Entity('project')
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    user_id!: string

    @Column()
    name!: string

    @Column()
    color!: string

    @Column({
        default: false,
    })
    favorite!: boolean

    @Column({
        default: false,
    })
    archived!: boolean

    @Column()
    order!: number

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    //project to task table
    @OneToMany(() => Task, (task) => task.project)
    tasks!: Task

    //project to section table
    @OneToMany(() => Section, (section) => section.project)
    sections!: Section

    //project to user table
    @ManyToOne(() => User, (user) => user.projects, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'user_id',
    })
    user!: User
}
