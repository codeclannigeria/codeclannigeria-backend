import { DeleteManyType } from '~shared/models/dto';

export interface IBaseController<
  TEntityDto,
  TCreateDto,
  TUpdateDto,
  TPagedInputDto,
  TPagedOutputDto
> {
  create(input: TCreateDto): TEntityDto | Promise<TEntityDto>;
  findAll(input: TPagedInputDto): TPagedOutputDto | Promise<TPagedOutputDto>;
  findById(input: string): TEntityDto | Promise<TEntityDto>;
  update(id: string, input: TUpdateDto): TEntityDto | Promise<TEntityDto>;
  delete(id: string, isHardDelete?: boolean): void | Promise<void>;
  deleteMany(input: DeleteManyType): void | Promise<void>;
}
