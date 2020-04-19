import {
  Body,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { ApiException } from './models/api-exception.model';
import { BaseEntity } from './models/base.entity';
import { PagedReqDto, PagedResDto } from './models/dto/paged.dto';
export type ClassType<T = any> = new (...args: any[]) => T;

export class BaseController<
  T extends BaseEntity,
  TDto,
  TCreateDto,
  TUpdateDto
> {
  constructor(private readonly baseService: BaseService<T>) {}

  @Get()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ type: ApiException })
  async findAll(@Query() query: PagedReqDto): Promise<PagedResDto<TDto>> {
    const { skip, limit, search } = query;
    const entities = await this.baseService
      .findAll(search && { $text: { $search: search } })
      .limit(limit)
      .skip(skip);
    const count = entities.length;
    const items = (entities as unknown) as TDto[];

    return { totalCount: count <= limit ? count : limit, items };
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Entity retrieved successfully.' })
  @ApiNotFoundResponse({
    type: ApiException,
    description: 'Entity does not exist',
  })
  async findById(@Param('id') id: string): Promise<TDto> {
    const entity = await this.baseService.findByIdAsync(id);
    if (!entity)
      throw new NotFoundException(`Entity with id ${id} does not exist`);
    return (entity as unknown) as TDto;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Entity successfully created.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async create(@Body() dto: TCreateDto): Promise<string> {
    const newEntity = this.baseService.createEntity(dto);
    await this.baseService.insertAsync(newEntity);
    return newEntity.id;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Entity deleted successfully.' })
  @ApiBadRequestResponse({ type: ApiException, description: 'Bad Request.' })
  async delete(@Param('id') id: string) {
    this.baseService.deleteByIdAsync(id);
  }

  @Put(':id')
  @ApiBadRequestResponse({ type: ApiException, description: 'Bad Request.' })
  @ApiOkResponse({ description: 'Entity deleted successfully.' })
  async update(
    @Param('id') id: string,
    @Body() dto: TUpdateDto,
  ): Promise<TDto> {
    const entity = await this.baseService.updateAsync(id, dto);
    return (entity as unknown) as TDto;
  }
}
