import { Prisma } from '@prisma/client';
import { ErrorRequestHandler } from 'express';
import { ErrorHandlingOptions } from './types';

const unPascalCase = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

const isValidCode = (code: any) =>
  isFinite(code) && Math.floor(code) === +code && code >= 100 && code <= 599;

const handlePrismaError: ErrorRequestHandler = (e, req, res) => {
  const model = unPascalCase(e.message?.split('.')?.at(1) || '');
  const message = e.message || '';
  const error = (msg: string, code?: number) => {
    res.status(code || 400).json(msg);
  };

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2014') {
      return error(
        `Sorry, you cannot delete this ${model} as there are things connected to it. If you want to, you will need to delete the connected things first.`,
      );
    }
  }

  error(message, isValidCode(e?.cause?.message) ? +e?.cause?.message : 400);
};

export const handleError =
  (options?: ErrorHandlingOptions): ErrorRequestHandler =>
  (error, req, res, next) => {
    console.error(error.stack);
    if (options?.prisma) return handlePrismaError(error, req, res, next);
    return res
      .status(isValidCode(error?.cause?.message) ? +error?.cause?.message : 400)
      .send(error?.message || 'Error');
  };
