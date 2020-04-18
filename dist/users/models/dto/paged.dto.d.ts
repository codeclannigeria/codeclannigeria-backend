import { PagedResDto } from '../../../shared/models/dto/paged.dto';
import { UserDto } from './user.dto';
export declare class PagedUserResDto extends PagedResDto<UserDto> {
    items: UserDto[];
}
