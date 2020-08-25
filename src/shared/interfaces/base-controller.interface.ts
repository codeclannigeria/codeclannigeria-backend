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
  delete(id: string): void | Promise<void>;
}
