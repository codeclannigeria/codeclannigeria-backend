import { Injectable } from '@nestjs/common';

import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}
  async getProfileAsync(email: string): Promise<User> {
    return this.usersService.findOneAsync({ email });
  }
}
