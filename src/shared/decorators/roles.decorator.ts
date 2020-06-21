import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { UserRole } from '../../users/models/user.entity';

export const Roles = (...roles: UserRole[]): CustomDecorator<typeof UserRole> =>
  SetMetadata(UserRole, roles);
