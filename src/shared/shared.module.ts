import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseEntity } from './models/base.entity';
import { BaseService, CurrentUserService } from './services';

const BaseModel = MongooseModule.forFeature([
  { name: BaseEntity.modelName, schema: BaseEntity.schema }
]);

@Global()
@Module({
  imports: [BaseModel],
  providers: [BaseService, CurrentUserService],
  exports: [BaseService, CurrentUserService, BaseModel]
})
export class SharedModule {}
