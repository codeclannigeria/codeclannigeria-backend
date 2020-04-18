export declare type ClassType<T = any> = new (...args: any[]) => T;
export declare abstract class PagedResDto<T> {
    totalCount: number;
    abstract items: T[];
}
export declare class PagedReqDto {
    skip?: number;
    limit?: number;
    search?: string;
}
export declare function PaginatedResponseDto<T extends ClassType>(Dto: T): {
    new (...args: any[]): {
        [x: string]: any;
        totalCount: number;
        items: T[];
    };
} & T;
