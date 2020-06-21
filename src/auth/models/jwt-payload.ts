import { UserRole } from '../../users/models/user.entity';
export interface JwtPayload {
  email: string;
  role: UserRole;
  userId: string;
}
