# Express Middleware

An opinionated set of middleware to use on an express API.

## Use

```ts
import attachMiddleware from '@richardx/express-middleware';
const app = express();
attachMiddleware(app, {
  handlePrismaErrors: boolean | undefined; // Enable if using prisma (catches prisma errors nicely)
  maxBodySize: string | undefined; // Max body size (default: 50mb)
} | undefined);
```

## Formatting

Formatting functions are provided through import

## Prisma Pagination

Pagination can be imported through `@richardx/express-middleware/prismaPagination`
