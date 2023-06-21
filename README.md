# Express Middleware

An opinionated set of middleware to use on an express API.

## Use

```ts
import attachMiddleware, { handleError } from 'rx-express-middleware';
const app = express();
attachMiddleware(app, {
  maxBodySize: string | undefined; // Max body size (default: 50mb)
  cookieSecret: string | undefined; // Secret for cookie parser
  cookieOptions: CookieParseOptions | undefined; // Cookie options
} | undefined);

app.use(baseRouter);

app.use(handleError({
  prisma: boolean | undefined; // Handle Prisma errors
}))
```

## Error Handling

If you want to specify a specific error code, you can set the error cause to it. For example:

```ts
throw new Error('unauthenticated', { cause: new Error('401') });
```

## Formatting

Formatting functions are provided through import

## Prisma Pagination

Pagination can be imported through `rx-express-middleware/dist/prismaPagination`

For example:

```ts
// index.ts
import { PrismaClient } from '@prisma/client';
import { initiatePagination } from 'rx-express-middleware/dist/prismaPagination';

export const prisma = new PrismaClient();
export const paginate = initiatePagination(10, prisma);

// controller.ts
import { paginate } from './index.ts';
import { RequestHandler } from 'express';

export const handler: RequestHandler = async (req, res) => {
  res.json(
    await paginate(req.stringQuery, 'user', {
      where: {
        name: { contains: req.stringQuery.name },
      },
      select: {
        name: true,
      },
    } as Prisma.UserFindManyArgs),
  );
};
```
