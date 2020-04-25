import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/models/user.entity';
export declare class SessionSerializer extends PassportSerializer {
    serializeUser(user: User, done: (err: Error, user: User) => void): any;
    deserializeUser(user: User, done: (err: Error, user: User) => void): any;
}
