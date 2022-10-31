import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import { globalRouter } from './router';
import models from './models';

async function main() {
  const API_PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8080;
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.json());

  app.use(`/api`, globalRouter);
  try {
    await models.sequelize.sync({
      // force: true,
    });
    console.info(`Models were synced successfully`);
  } catch (error) {
    console.error(error);
    console.error(`Models could not be synced`);
  }

  app.listen(API_PORT, () => {
    console.info({ message: `API  started on port ${API_PORT}` });
  });
}

main().catch((error) => {
  console.error(error);
});
