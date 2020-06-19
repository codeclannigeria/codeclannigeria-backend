export interface AbstractControllerOptions<
  TEntity,
  TEntityDto,
  TCreateDto,
  TUpdateDto,
  TPagedResDto
> {
  entity: { new (): TEntity };
  entityDto: { new (): TEntityDto };
  createDto: { new (): TCreateDto };
  updateDto: { new (): TUpdateDto };
  pagedResDto: { new (): TPagedResDto };
}
