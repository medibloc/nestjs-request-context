import { Controller, Get } from '@nestjs/common';
import { MyRequestContext } from './test.model';
import { RequestContext } from '../src';
import { TestService } from './test.service';

@Controller('')
export class TestController {
  constructor(private svc: TestService) {}

  static counter = 0;

  @Get()
  async test(): Promise<string> {
    const ctx: MyRequestContext = RequestContext.get();
    ctx.actor = `Jack-${TestController.counter++}`;

    await TestController.delay(2000);

    return this.svc.test();
  }

  static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
