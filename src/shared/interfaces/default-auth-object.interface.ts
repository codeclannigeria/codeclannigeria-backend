import { UserRole } from '../../users/models/user.entity';

interface AuthObj {
  enableAuth: boolean;
  authRoles: UserRole[];
}
export interface ControllerAuth {
  find: AuthObj;
  findById: AuthObj;
  create: AuthObj;
  update: AuthObj;
  delete: AuthObj;
}

export interface DefaultAuthObject {
  find?: boolean | UserRole[];
  findById?: boolean | UserRole[];
  create?: boolean | UserRole[];
  update?: boolean | UserRole[];
  delete?: boolean | UserRole[];
}
