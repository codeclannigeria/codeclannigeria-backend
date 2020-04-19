export interface AbstractControllerOptions<TEntity, TEntityDto, TCreateDto> {
    entity: {
        new (): TEntity;
    };
    entityDto: {
        new (): TEntityDto;
    };
    createDto: {
        new (): TCreateDto;
    };
}
