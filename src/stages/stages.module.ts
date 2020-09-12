import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { TasksModule } from '../tasks/tasks.module';
import { TracksModule } from '../tracks/tracks.module';
import { Stage } from './models/stage.entity';
import { StagesController } from './stages.controller';
import { StagesService } from './stages.service';

const StageModel = MongooseModule.forFeature([
  { name: Stage.modelName, schema: Stage.schema }
]);
const baseService = { provide: BaseService, useClass: StagesService };
@Module({
  imports: [StageModel, TracksModule, forwardRef(() => TasksModule)],
  providers: [StagesService, baseService],
  controllers: [StagesController],
  exports: [StageModel, StagesService, baseService]
})
export class StagesModule {}
