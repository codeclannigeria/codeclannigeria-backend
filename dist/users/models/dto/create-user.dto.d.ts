import { UserDto } from './user.dto';
declare const CreateUserDto_base: import("@nestjs/common").Type<Pick<UserDto, "firstName" | "lastName" | "email" | "password">>;
export declare class CreateUserDto extends CreateUserDto_base {
}
export {};
