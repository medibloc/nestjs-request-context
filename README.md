# nestjs-request-context

A NestJS module that stores any type of data in the request-scope and makes it accessible
from any layer, such as singleton service layers or even repository layers.

Since [AsyncLocalStorage](https://nodejs.org/api/async_hooks.html#async_hooks_class_asynclocalstorage)
is used internally, the required Node.js version is >=14.15.2 that includes significant fixes.


## Installation

```bash
yarn add '@medibloc/nestjs-request-context'
```

## Usage

There are several ways to enable the request context.

### Using middleware in the module

Extend `RequestContext` to include any data you want.
```ts
import { RequestContext } from '@medibloc/nestjs-request-context';

export class MyRequestContext extends RequestContext {
  actor: string;
}
```

Import `RequestContextModule` to your `AppModule` with specifying the context class that you defined above.
It automatically registers a middleware that initialize a context for each request (for all route path `*`).

```ts
import { RequestContextModule } from '@medibloc/nestjs-request-context';
import { MyRequestContext } from './my-context.model';

@Module({
  imports: [
    RequestContextModule.forRoot({
      contextClass: MyRequestContext,
      isGlobal: true,
    })
  ]
})
export class AppModule {}
```

If `isGlobal` is `true`, you will not need to import `RequestContextModule` in other modules once it's been loaded in the root module.

Now, you can access the request context from any Controller/Resolver/Service/Repository layers.

```ts
import { RequestContext } from '@medibloc/nestjs-request-context';
import { MyRequestContext } from './my-context.model';

@Controller('')
export class MyController {
  @Get()
  test(): string {
    const ctx: MyRequestContext = RequestContext.get();
    ctx.actor = 'Jack';
    
    return this.myService.test();
  }
}

@Injectable()
export class MyService {
  test(): string {
    const ctx: MyRequestContext = RequestContext.get();
    console.log(`current actor: ${ctx.actor}`);
    
    return ctx.actor;
  }
}
```

### Using functional middleware

If you prefer to use the functional middleware rather than import the module `RequestContextModule`,
you can use the `requestContextMiddleware` function by passing the context class that you want.
In this case, you don't need to import the `RequestContextModule` to the `AppModule`.

```ts
import { requestContextMiddleware } from '@medibloc/nestjs-request-context';
import { MyRequestContext } from './my-context.model';

const app = await NestFactory(AppModule);
...
app.use(requestContextMiddleware(MyRequestContext));

await app.listen(3000);
```
Later steps are the same as in [the section above](#using-middleware-in-the-module).

### For GraphQL Subscriptions

If you use GraphQL Subscriptions, the request context middleware will not be executed automatically,
because NestJS middlewares are not for Websocket connections.

If you want to initialize the request context for each Websocket connection,
please set the `onConnect` option like below.
In this case, you don't need to import the `RequestContextModule` to the `AppModule`
or use the `requestContextMiddleware` function.

```ts
@Module({
  GraphQLModule.forRoot({
    installSubscriptionHandlers: true,
    subscriptions: {
      onConnect: () => RequestContext.start(PaletteRequestContext),
    },
  }), 
})
export class AppModule{}
```
