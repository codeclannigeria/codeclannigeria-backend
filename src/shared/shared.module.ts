import { DynamicModule, Global, Module } from '@nestjs/common';

import { AbstractCoreService } from './services/abstract-core.service';
import { CoreMongooseService } from './services/core-mongoose.service';
import { CurrentUserService } from './services/current-user.service';

@Global()
@Module({ providers: [CurrentUserService] })
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,

      providers: [
        { provide: AbstractCoreService, useClass: CoreMongooseService },
      ],
    };
  }
}
