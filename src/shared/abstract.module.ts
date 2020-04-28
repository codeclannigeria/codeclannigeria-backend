import { DynamicModule, Global, Module } from '@nestjs/common';

import { AbstractCoreService } from './services/abstract-core.service';
import { CoreMongooseService } from './services/core-mongoose.service';

@Global()
@Module({})
export class AbstractModule {
  static forRoot(): DynamicModule {
    return {
      module: AbstractModule,

      providers: [
        { provide: AbstractCoreService, useClass: CoreMongooseService },
      ],
    };
  }
}
