import AppDataSource from '../../../configs/connect';
import { TaskReq } from '../interfaces/task-req';
import { Task } from '../models/task-model';

class TaskRepo {
  private readonly _db = AppDataSource;
  static _db: any = AppDataSource;

  getTask = async (sort: string = 'DESC', projectId: string) => {
    return this._db
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.section', 'section')
      .where('task.project_id = :projectId', { projectId: projectId })
      .orderBy('task.order', 'ASC')
      .addOrderBy('task.updated_at', sort as any)
      .getMany();
  };

  countTask = async (projectId: string) => {
    const task = this._db
      .createQueryBuilder()
      .select('task')
      .from(Task, 'task')
      .where('task.project_id = :projectId', { projectId: projectId });

    return task.getCount();
  };

  getOneTask = async (id: string) => {
    return this._db
      .createQueryBuilder()
      .select('task')
      .from(Task, 'task')
      .where('task.id = :taskId', { taskId: id })
      .getOne();
  };

  searchTask = async (params: TaskReq, one: boolean) => {
    const task = this._db
      .createQueryBuilder()
      .select('task')
      .from(Task, 'task');

    Object.entries(params).forEach(([key, value], index) => {
      if (index === 0) {
        task.where(`task.${key} = :param`, { param: 'ampas' });
      } else {
        task.andWhere(`task.${key} = :param`, { param: value });
      }
    });

    return one ? task.getOne() : task.getMany();
  };

  createTask = async (data: Task, projectId: string) => {
    data.order = ((await this.countTask(projectId)) as unknown as number) + 1;
    data.project_id = projectId;
    const create = await this._db
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values(data)
      .execute();

    return create.raw[0];
  };

  updateTask = async (data: TaskReq, id: string, taskData: Task) => {
    let reorder = 0;
    let sort = 'DESC';
    Object.entries(data).forEach(async ([key, value], index) => {
      if (key === 'order') {
        reorder = 1;
        const newOrder = value;

        const oldOrder = taskData.order;

        if (newOrder > oldOrder) {
          sort = 'ASC';
        } else if (newOrder == oldOrder) {
          reorder = 0;
        }
      }
    });

    const task = await this._db
      .createQueryBuilder()
      .update('task')
      .set(data)
      .where('task.id = :taskId', { taskId: id })
      .execute();

    if (reorder === 1) {
      await this.reorderTask(sort, taskData.project_id);
    }

    return task;
  };

  deleteTask = async (id: string, projectId: string) => {
    const deleteTask = await Task.delete(id);

    await this.reorderTask('DESC', projectId);

    return deleteTask;
  };

  reorderTask = async (sort: string = 'DESC', projectId: string) => {
    const task: any = await this.getTask(sort, projectId);
    if (task) {
      task.forEach(async (value: any, index: any) => {
        await this._db
          .createQueryBuilder()
          .update('task')
          .set({ order: index + 1 })
          .where('id = :taskId', { taskId: value.id })
          .execute();
      });
    }
  };
}

export default TaskRepo;
