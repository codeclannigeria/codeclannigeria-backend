import { PaginatedResDto } from '../../../shared/models/dto/paged-res.dto';
import { UserDto } from './user.dto';

export class PagedUserResDto extends PaginatedResDto(UserDto) {}
