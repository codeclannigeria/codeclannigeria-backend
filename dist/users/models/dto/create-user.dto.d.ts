import { UserDto } from './user.dto';
declare const CreateUserDto_base: import("@nestjs/common").Type<Pick<UserDto, "firstName" | "lastName" | "email" | "role">>;
export declare class CreateUserDto extends CreateUserDto_base {
    password: string;
}
export {};
