# Express Middleware

An opinionated set of middleware to use on an express API.

## Use

```ts
import attachMiddleware, { handleError } from '@rx-express-middleware';
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

## Formatting

Formatting functions are provided through import

## Prisma Pagination

Pagination can be imported through `rx-express-middleware/prismaPagination`
