import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { Stage } from './models/stage.entity.ts';
import { StagesController } from './stages.controller';
import { StagesService } from './stages.service';

const StageModel = MongooseModule.forFeature([
  { name: Stage.modelName, schema: Stage.schema }
]);
const baseService = { provide: BaseService, useClass: StagesService };
@Module({
  imports: [StageModel],
  providers: [StagesService, baseService],
  controllers: [StagesController],
  exports: [StageModel, StagesService, baseService]
})
export class StagesModule {}
