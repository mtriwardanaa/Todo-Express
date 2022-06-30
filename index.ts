import express from 'express';
import connect from './src/configs/connect';
import config from './src/configs/config';
import startServer from './src/configs/start-server';

const app = express();
const PORT = config.appPort;

app.listen(PORT, async () => {
  console.log(`Server running ${PORT}`);

  connect;

  startServer(app);
});
