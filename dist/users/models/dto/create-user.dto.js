"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto extends swagger_1.OmitType(user_dto_1.UserDto, ['id']) {
}
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map