import 'express-async-errors';
import { Express, json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config as initEnv } from 'dotenv';
import { Options } from './types';
import { queries } from './queries';

initEnv();

const attachMiddleware = (app: Express, options?: Options) => {
  const maxBodySize = options?.maxBodySize || '50mb';

  app.use(json({ limit: maxBodySize }));
  app.use(cors());
  app.use(queries);
  app.use(morgan('dev'));
  app.use(cookieParser(options?.cookieSecret, options?.cookieOptions));
};

export * from './formatting';
export * from './error';
export default attachMiddleware;
