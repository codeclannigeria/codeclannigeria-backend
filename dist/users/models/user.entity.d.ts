import { BaseEntity } from '../../shared/models/base.entity';
export declare class User extends BaseEntity {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    get fullName(): string;
}
