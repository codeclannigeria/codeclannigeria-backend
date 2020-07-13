import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { User } from '../users/models/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void): any {
    done(null, user);
  }
  deserializeUser(user: User, done: (err: Error, user: User) => void): any {
    done(null, user);
  }
}
