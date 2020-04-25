import { AbstractModel } from '../models';

export type AbstractDocument<T> = T extends AbstractModel ? T : any;
export type IdType = string | number;
export type UpdateResultType<T> = T extends AbstractModel ? T : any;

export type DeleteResultType<T> = T extends AbstractModel ? T : any;
export type ClassType<T = any> = new (...args: any[]) => T;
