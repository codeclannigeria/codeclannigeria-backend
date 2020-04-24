import { AbstractModel } from '../models';
export declare type AbstractDocument<T> = T extends AbstractModel ? T : any;
export declare type IdType = string | number;
export declare type UpdateResultType<T> = T extends AbstractModel ? T : any;
export declare type DeleteResultType<T> = T extends AbstractModel ? T : any;
