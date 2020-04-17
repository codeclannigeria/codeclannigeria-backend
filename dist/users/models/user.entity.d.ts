import { BaseEntity } from 'src/shared/models/base.entity';
export declare class User extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
