import { ModuleRef } from '@nestjs/core';
import { Strategy } from 'passport-local';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private moduleRef;
    constructor(moduleRef: ModuleRef);
    validate(request: Request, username: string, password: string): Promise<any>;
}
export {};
