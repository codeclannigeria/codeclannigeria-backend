import { DynamicModule, Global, Module } from '@nestjs/common';

import { AbstractService, BaseService, CurrentUserService } from './services';

@Global()
@Module({ providers: [CurrentUserService] })
export class SharedModule {
  static forRoot(): DynamicModule {
    const provider = { provide: AbstractService, useClass: BaseService };
    return {
      module: SharedModule,
      providers: [provider],
      exports: [provider],
      global: true
    };
  }
}
