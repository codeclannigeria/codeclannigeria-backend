import { BaseService } from './base.service';
import { BaseEntity } from './models/base.entity';
import { PagedReqDto, PagedResDto } from './models/dto/paged.dto';
export declare type ClassType<T = any> = new (...args: any[]) => T;
export declare class BaseController<T extends BaseEntity, TDto, TCreateDto, TUpdateDto> {
    protected readonly baseService: BaseService<T>;
    constructor(baseService: BaseService<T>);
    findAll(query: PagedReqDto): Promise<PagedResDto<TDto>>;
    findById(id: string): Promise<TDto>;
    create(dto: TCreateDto): Promise<string>;
    delete(id: string): Promise<void>;
    update(id: string, dto: TUpdateDto): Promise<TDto>;
}
