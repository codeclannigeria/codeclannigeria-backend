export declare class ApiException {
    statusCode?: number;
    message?: string;
    status?: string;
    error?: string;
    errors?: any;
    timestamp?: string;
    path?: string;
    stack?: string;
    constructor(message: string, error: string, stack: string, errors: any, path: string, statusCode: number);
}
