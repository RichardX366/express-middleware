import { NextFunction, Request, Response } from 'express';

export const queries = (req: Request, res: Response, next: NextFunction) => {
  req.stringQuery = Object.fromEntries(
    Object.entries(req.query).filter(
      ([, value]) => typeof value === 'string' && value !== '',
    ) as [string, string][],
  );
  req.booleanQuery = Object.fromEntries(
    Object.entries(req.query).map(([key, value]) => [key, value === 'true']),
  );
  next();
};
