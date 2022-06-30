import { DataSource } from 'typeorm';
import { Comment } from '../Modules/comment/models/comment-model';
import { Project } from '../Modules/project/models/project-model';
import { Section } from '../Modules/task/models/section-model';
import { Task } from '../Modules/task/models/task-model';
import { User } from '../Modules/user/models/user-model';
import config from './config';

const port = config.dbPort as number;
const type: any = config.dbType;

const AppDataSource = new DataSource({
  type: type,
  host: config.dbHost,
  port: port,
  username: config.dbUser,
  password: config.dbPass,
  database: config.dbName,
  entities: [User, Project, Section, Task, Comment],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
