import { PagedResDto } from '../../../shared/models/dto/paged.dto';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PagedUserResDto extends PagedResDto<UserDto> {
  @ApiProperty({
    isArray: true,
    type: UserDto,
  })
  items: UserDto[];
}
