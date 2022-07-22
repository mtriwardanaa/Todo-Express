import { Priority } from '../models/task-model';

export interface TaskReq {
  id?: string;
  parent_id?: string;
  project_id?: string;
  section_id?: string;
  new_section_id?: string;
  new_parent_id?: string;
  user_id?: string;
  name?: string;
  desc?: string;
  due_date?: Date;
  priority?: Priority;
  compeleted?: boolean;
  order?: string;
}
