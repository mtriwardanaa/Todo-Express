import express from 'express';
import connect from './configs/connect';
import config from './configs/config';
import startServer from './configs/start-server';

const app = express();
const PORT = config.appPort;

app.listen(PORT, async () => {
  console.log(`Server running ${PORT}`);

  connect;

  startServer(app);
});
