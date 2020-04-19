export declare type ClassType<T = any> = new (...args: any[]) => T;
export declare class PagedResDto<T> {
    constructor(totalCount: number, items: T[], type: Function);
    private type;
    totalCount: number;
    items: T[];
}
export interface IPaged<T> {
    totalCount: number;
    items: T[];
}
export declare class PagedReqDto {
    skip?: number;
    limit?: number;
    search?: string;
}
export declare function PaginatedResponseDto<T extends ClassType>(entityDto: T): any;
