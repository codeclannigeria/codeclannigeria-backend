import { AbstractControllerOptions } from './interfaces/base-controller-interface';
import { BaseEntity } from './models/base.entity';
export declare function AbstractCrudController<T extends BaseEntity, TEntityDto, TCreateDto, TUpdateDto = TEntityDto>(options: AbstractControllerOptions<T, TEntityDto, TCreateDto>): any;
