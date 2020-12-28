import { Inject, Injectable, NestMiddleware, OnModuleInit } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestContext } from './request-context.model';
import { REQUEST_CONTEXT_MODULE_OPTIONS } from './request-context.constants';
import { RequestContextModuleOptions } from './request-context.module';

@Injectable()
export class RequestContextMiddleware<T extends RequestContext> implements NestMiddleware<Request, Response>, OnModuleInit {
  constructor(
    @Inject(REQUEST_CONTEXT_MODULE_OPTIONS)
    private readonly options: RequestContextModuleOptions<T>,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    middleware(this.options.contextClass, req, res, next);
  }

  onModuleInit(): void {
    // do nothing
  }
}

export function requestContextMiddleware<T extends RequestContext>(
  contextClass: (new () => T),
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    middleware(contextClass, req, res, next);
  }
}

function middleware<T extends RequestContext>(
  contextClass: (new () => T), req: Request, res: Response, next: NextFunction,
): void {
  RequestContext.start(contextClass);
  next();
}
