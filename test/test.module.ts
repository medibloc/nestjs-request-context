import { Module } from '@nestjs/common';
import { RequestContextModule } from '../src';
import { MyRequestContext } from './test.model';
import { TestService } from './test.service';
import { TestController } from './test.controller';

@Module({
  imports: [
    RequestContextModule.forRoot({
      contextClass: MyRequestContext,
    }),
  ],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule{}
