import { BaseEntity } from '../../shared/models/base.entity';
export declare enum UserRole {
    User = "User",
    Admin = "Admin"
}
export declare class User extends BaseEntity {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly role: UserRole;
    get fullName(): string;
}
