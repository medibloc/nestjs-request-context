import { Injectable } from '@nestjs/common';
import { MyRequestContext } from './test.model';
import { RequestContext } from '../src';

@Injectable()
export class TestService {
  test(): string {
    const ctx: MyRequestContext = RequestContext.get();
    return ctx.actor;  // Returns actor as it is
  }
}
