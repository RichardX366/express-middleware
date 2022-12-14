import { Prisma } from '@prisma/client';
import { ErrorRequestHandler } from 'express';

const unPascalCase = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

const handlePrismaError: ErrorRequestHandler = (e, req, res) => {
  const model = unPascalCase(
    e.message?.split('.') ? e.message.split('.')[1] : '',
  );
  const msg = e.message || '';
  const error = (msg: string) => res.status(400).send(msg);

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2014') {
      return error(
        `Sorry, you cannot delete this ${model} as there are things connected to it. If you want to, you will need to delete the connected things first.`,
      );
    }
  }

  if (
    msg.match('Unique|delete()|update()') &&
    msg.includes('Argument id: Got invalid value')
  ) {
    return error(`You must provide a valid ${model} ID.`);
  }

  if (
    msg.includes(
      'An operation failed because it depends on one or more records that were required but not found.',
    )
  ) {
    return error(`The specified ${model} does not exist.`);
  }
};

const handleError =
  (options?: { prisma?: boolean }): ErrorRequestHandler =>
  (error, req, res, next) => {
    if (options?.prisma) handlePrismaError(error, req, res, next);
    console.error(error.stack);
    return res.status(400).send(error.message);
  };

export default handleError;
