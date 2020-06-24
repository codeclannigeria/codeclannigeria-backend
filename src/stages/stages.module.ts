import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { Stage } from './models/stage.entity.ts';
import { StagesController } from './stages.controller';
import { StagesService } from './stages.service';

const StageModel = MongooseModule.forFeature([
  { name: Stage.modelName, schema: Stage.schema }
]);
@Module({
  imports: [StageModel],
  providers: [StagesService, { provide: BaseService, useClass: StagesService }],
  controllers: [StagesController],
  exports: [StageModel, StagesService]
})
export class StagesModule {}
