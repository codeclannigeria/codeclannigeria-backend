import { UserDto } from './user.dto';
import { PagedResDto } from '~shared/models/dto/paged-res.dto';

export class PagedUserResDto extends PagedResDto(UserDto) {}
