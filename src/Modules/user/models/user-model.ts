import {
    Column,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
} from 'typeorm'
import { hashPass } from '../../../utils/bcrypt-pass'
import { Project } from '../../project/models/project-model'
import { Task } from '../../task/models/task-model'
import { Comment } from '../../comment/models/comment-model'

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string

    @Column()
    username!: string

    @Column()
    password!: string

    @Column({
        default: true,
        name: 'active',
    })
    is_active!: boolean

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    //user to task table, sementara belum di pakai
    @OneToMany(() => Task, (task) => task.section)
    tasks!: Task

    //user to project table
    @OneToMany(() => Project, (project) => project.user)
    projects!: Project

    //user to comment table
    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment

    @BeforeInsert()
    bycriptPass() {
        this.password = hashPass(this.password)
    }
}
