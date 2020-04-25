"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = require("@nestjs/swagger");
const paged_res_dto_1 = require("../../../shared/models/dto/paged-res.dto");
const user_dto_1 = require("./user.dto");
class PagedUserResDto extends paged_res_dto_1.PaginatedResDto(user_dto_1.UserDto) {
}
exports.PagedUserResDto = PagedUserResDto;
//# sourceMappingURL=paged-user.dto.js.map