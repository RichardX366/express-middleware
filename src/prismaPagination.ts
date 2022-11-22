import type { PrismaClient } from '@prisma/client';
import { removeUndefinedValues } from './formatting';

/** If you want type checking on the query params, do `as Prisma.xxxFindManyArgs` */
export const initiatePagination =
  (itemsPerPage: number, prisma: PrismaClient) =>
  async <T = any>(
    { page = '1', pageSize = itemsPerPage.toString() }: { [k: string]: string },
    model: keyof Omit<
      PrismaClient,
      | '$connect'
      | '$disconnect'
      | '$executeRaw'
      | '$executeRawUnsafe'
      | '$on'
      | '$queryRaw'
      | '$queryRawUnsafe'
      | '$transaction'
      | '$use'
    >,
    queryData: any,
  ): Promise<{ data: T[]; total: number; totalPages: number }> => {
    const [data, total] = await prisma.$transaction([
      (prisma[model].findMany as any)({
        ...removeUndefinedValues(queryData),
        skip: (+page - 1) * +pageSize,
        take: +pageSize,
      }),
      (prisma[model].count as any)({ where: queryData.where }),
    ]);
    return {
      data,
      total,
      totalPages: Math.ceil(total / +pageSize),
    };
  };
