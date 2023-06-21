import { Prisma } from '@prisma/client';
import { ErrorRequestHandler } from 'express';
import { ErrorHandlingOptions } from './types';

const unPascalCase = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

const isValidCode = (code: any) =>
  isFinite(code) && Math.floor(code) === code && code >= 100 && code <= 599;

const handlePrismaError: ErrorRequestHandler = (e, req, res) => {
  const model = unPascalCase(e.message?.split('.')?.at(1) || '');
  const message = e.message || '';
  const error = (msg: string) => res.status(400).send(msg);

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2014') {
      return error(
        `Sorry, you cannot delete this ${model} as there are things connected to it. If you want to, you will need to delete the connected things first.`,
      );
    }
  }

  if (
    message.match('Unique|delete()|update()') &&
    message.includes('Argument id: Got invalid value')
  ) {
    return error(`You must provide a valid ${model} ID.`);
  }

  if (
    message.includes(
      'An operation failed because it depends on one or more records that were required but not found.',
    )
  ) {
    return error(`The specified ${model} does not exist.`);
  }

  res
    .status(isValidCode(e?.cause?.message) ? +e?.cause?.message : 400)
    .send(message);
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
