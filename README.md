# Express Middleware

An opinionated set of middleware to use on an express API.

## Use

```ts
import attachMiddleware from '@rx-express-middleware';
const app = express();
attachMiddleware(app, {
  handlePrismaErrors: boolean | undefined; // Enable if using prisma (catches prisma errors nicely)
  maxBodySize: string | undefined; // Max body size (default: 50mb)
  cookieSecret: string | undefined; // Secret for cookie parser
  cookieOptions: CookieParseOptions | undefined; // Cookie options
} | undefined);
```

## Formatting

Formatting functions are provided through import

## Prisma Pagination

Pagination can be imported through `rx-express-middleware/prismaPagination`
