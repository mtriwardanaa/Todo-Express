import { IsNull } from 'typeorm';
import AppDataSource from '../../../configs/connect';
import { checkNull, generateSubtask } from '../../../utils/helper';
import { TaskReq } from '../interfaces/task-req';
import { Task } from '../models/task-model';

class TaskRepo {
  private readonly _db = AppDataSource;
  static _db: any = AppDataSource;

  static getTask = async (
    sort: string = 'DESC',
    projectId: string,
    sectionId: string | null,
    parentId: string | null
  ) => {
    return this._db.getRepository(Task).find({
      relations: ['subtasks', 'section', 'parent'],
      where: [
        {
          project_id: projectId,
          section_id: !checkNull(sectionId) ? sectionId : IsNull(),
          parent_id: !checkNull(parentId) ? parentId : IsNull(),
        },
      ],
      order: {
        order: 'ASC',
        updated_at: sort,
        subtasks: {
          order: 'ASC',
        },
      },
    });
  };

  static getTaskById = async (
    projectId: string,
    sectionId: string | null,
    id: string | null
  ) => {
    return this._db.getRepository(Task).find({
      where: [
        {
          project_id: projectId,
          section_id: !checkNull(sectionId) ? sectionId : IsNull(),
          id: !checkNull(id) ? id : IsNull(),
        },
      ],
    });
  };

  static countTask = async (
    projectId: string,
    sectionId: string,
    parentId: string | null
  ) => {
    const task = this._db
      .createQueryBuilder()
      .select('task')
      .from(Task, 'task')
      .where('task.project_id = :projectId', { projectId });

    checkNull(sectionId)
      ? task.andWhere('task.section_id IS NULL')
      : task.andWhere('task.section_id = :sectionId', { sectionId });

    checkNull(parentId)
      ? task.andWhere('task.parent_id IS NULL')
      : task.andWhere('task.parent_id = :parentId', { parentId });

    return task.getCount();
  };

  static getOneTask = async (id: string) => {
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
        task.where(`${key} = :param`, { param: value });
      } else {
        console.log(key, value, `${key} = :param`);
        task.andWhere(`${key} = :param`, { param: value });
      }
    });

    return one ? task.getOne() : task.getMany();
  };

  createTask = async (data: Task) => {
    const create = await this._db
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values(data)
      .execute();

    return create.raw[0];
  };

  updateTask = async (data: TaskReq, id: string) => {
    const task = await this._db
      .createQueryBuilder()
      .update('task')
      .set(data)
      .where('task.id = :taskId', { taskId: id })
      .execute();

    return task;
  };

  deleteTask = async (id: string, projectId: string) => {
    const deleteTask = await Task.delete(id);

    // await this.reorderTask('DESC', projectId);

    return deleteTask;
  };

  static reorderTask = async (dataTask: Task[]) => {
    dataTask.forEach(async (value: any, index: any) => {
      let sectionOrder = 0;
      if (!checkNull(value.section_id)) {
        sectionOrder = value.section.order;
      }

      if (!checkNull(value.parent_id)) {
        sectionOrder = value.parent.order;
      }

      await this._db
        .createQueryBuilder()
        .update('task')
        .set({ order: `${sectionOrder}${index + 1}` })
        .where('id = :taskId', { taskId: value.id })
        .execute();

      if (!checkNull(value.subtasks)) {
        value.subtasks.forEach(async (sub: any, idx: any) => {
          await this._db
            .createQueryBuilder()
            .update('task')
            .set({ order: `${sectionOrder}${index + 1}${idx + 1}` })
            .where('id = :taskId', { taskId: sub.id })
            .execute();
        });
      }
    });
  };
}

export default TaskRepo;
