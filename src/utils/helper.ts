import { Task } from '../Modules/task/models/task-model';

const checkNull = (data: any) => {
  if (data == null) {
    return true;
  }

  if (data === null) {
    return true;
  }

  if (data === '') {
    return true;
  }

  if (typeof data == 'object') {
    const isEmpty = Object.keys(data).length === 0;
    if (isEmpty) {
      return true;
    }
  }

  if (typeof data === 'undefined') {
    return true;
  }

  return false;
};

const generateSubtask = async (arr: Task[], parent = null) => {
  let data: any[] = [];
  arr.forEach(async (value: any, index: any) => {
    if (value.parent_id == parent) {
      value.subtasks = await generateSubtask(arr, value.id);
      data.push(value);
    }
  });
  return data;
};

export { checkNull, generateSubtask };
