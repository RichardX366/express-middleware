import { CookieParseOptions } from 'cookie-parser';

declare module 'express-serve-static-core' {
  interface Request {
    // query where only string values are present (the rest are removed)
    stringQuery: { [key: string]: string };
    booleanQuery: { [key: string]: boolean };
  }
}

export interface Options {
  handlePrismaErrors?: boolean;
  maxBodySize?: string;
  cookieSecret?: string;
  cookieOptions?: CookieParseOptions;
}
