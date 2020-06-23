import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UserRole } from '../users/models/user.entity';
import { CreateStageDto } from './models/dtos/create-stage.dto.ts';
import { PagedListStageDto, StageDto } from './models/dtos/stage.dto.ts';
import { Stage } from './models/stage.entity.ts';
import { StagesService } from './stages.service';

const BaseCtrl = BaseCrudController<Stage, StageDto, CreateStageDto>({
  entity: Stage,
  entityDto: StageDto,
  createDto: CreateStageDto,
  updateDto: CreateStageDto,
  pagedListDto: PagedListStageDto,
  auth: {
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN]
  }
});

export class StagesController extends BaseCtrl {
  constructor(protected readonly stageService: StagesService) {
    super(stageService);
  }
  @Post()
  @ApiResponse({ type: StageDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateStageDto): Promise<StageDto> {
    const exist = await this.stageService.findOneAsync({
      title: input.title.toUpperCase()
    });
    if (exist)
      throw new ConflictException(
        `Stage with the title "${exist.title}" already exists`
      );
    return super.create(input);
  }
}
