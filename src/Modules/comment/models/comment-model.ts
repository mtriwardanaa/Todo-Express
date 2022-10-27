import {
    Column,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Task } from '../../task/models/task-model'
import { User } from '../../user/models/user-model'

@Entity('comment')
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    task_id!: string

    @Column()
    user_id!: string

    @Column()
    comment!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    //comment to task table
    @ManyToOne(() => Task, (task) => task.comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'task_id',
    })
    task!: Task

    //comment to task table
    @ManyToOne(() => User, (user) => user.comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'user_id',
    })
    user!: User
}
