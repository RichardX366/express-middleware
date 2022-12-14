import 'express-async-errors';
import { Express, json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config as initEnv } from 'dotenv';
import { Options } from './types';
import { queries } from './queries';
import handleError from './error';

initEnv();

const attachMiddleware = (app: Express, options?: Options) => {
  const maxBodySize = options?.maxBodySize || '50mb';

  app.use(json({ limit: maxBodySize }));
  app.use(
    urlencoded({
      limit: maxBodySize,
      extended: true,
      parameterLimit: 50000,
    }),
  );
  app.use(cors());
  app.use(queries);
  app.use(morgan('dev'));
  app.use(cookieParser(options?.cookieSecret, options?.cookieOptions));
  app.use(
    handleError({
      prisma: options?.handlePrismaErrors,
    }),
  );
};

export * from './formatting';
export default attachMiddleware;
