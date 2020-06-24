import { DefaultAuthObject } from './default-auth-object.interface';

export interface BaseControllerOptions<T> {
  entity: { new (doc?: any): T };
}

export interface BaseControllerWithAuthOptions<T>
  extends BaseControllerOptions<T> {
  auth: DefaultAuthObject | boolean;
}
export interface BaseControllerWithSwaggerOpts<
  TEntity,
  TEntityDto,
  TCreateDto,
  TUpdateDto,
  TPagedEntityOutputDto
> extends BaseControllerWithAuthOptions<TEntity> {
  entityDto: { new (): TEntityDto };
  createDto: { new (): TCreateDto };
  updateDto: { new (): TUpdateDto };
  pagedListDto: { new (): TPagedEntityOutputDto };
}
