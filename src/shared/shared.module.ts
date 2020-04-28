import { DynamicModule, Global, Module } from '@nestjs/common';

import { AbstractService, BaseService, CurrentUserService } from './services';

@Global()
@Module({ providers: [CurrentUserService] })
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      providers: [{ provide: AbstractService, useClass: BaseService }],
    };
  }
}
