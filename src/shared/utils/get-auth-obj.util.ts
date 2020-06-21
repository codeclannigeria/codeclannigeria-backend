import { UserRole } from '../../users/models/user.entity';
import {
  DefaultAuthObject,
  ControllerAuth
} from '../interfaces/default-auth-object.interface';

const roles = Object.values(UserRole);

const defaultAuth: ControllerAuth = {
  find: {
    enableAuth: true,
    authRoles: roles
  },
  findById: {
    enableAuth: true,
    authRoles: roles
  },
  create: {
    enableAuth: true,
    authRoles: roles
  },
  update: {
    enableAuth: true,
    authRoles: roles
  },
  delete: {
    enableAuth: true,
    authRoles: roles
  }
};

export const getAuthObj = (
  authObj: DefaultAuthObject | boolean
): ControllerAuth => {
  if (typeof authObj === 'boolean') {
    if (authObj === false) {
      defaultAuth.create.enableAuth = false;
      defaultAuth.delete.enableAuth = false;
      defaultAuth.find.enableAuth = false;
      defaultAuth.findById.enableAuth = false;
      defaultAuth.update.enableAuth = false;
      return defaultAuth;
    }
    if (authObj === true) return defaultAuth;
  }

  if (typeof authObj?.find === 'boolean') {
    defaultAuth.find.enableAuth = authObj.find;
  } else if (authObj?.find?.length) {
    defaultAuth.find.authRoles = authObj.find;
  }

  if (typeof authObj?.findById === 'boolean') {
    defaultAuth.findById.enableAuth = authObj.findById;
  } else if (authObj?.findById?.length) {
    defaultAuth.findById.authRoles = authObj.findById;
  }

  if (typeof authObj?.update === 'boolean') {
    defaultAuth.update.enableAuth = authObj.update;
  } else if (authObj?.update?.length) {
    defaultAuth.update.authRoles = authObj.update;
  }

  if (typeof authObj?.create === 'boolean') {
    defaultAuth.create.enableAuth = authObj.create;
  } else if (authObj?.create?.length) {
    defaultAuth.create.authRoles = authObj.create;
  }

  if (typeof authObj?.delete === 'boolean') {
    defaultAuth.delete.enableAuth = authObj.delete;
  } else if (authObj?.delete?.length) {
    defaultAuth.delete.authRoles = authObj.delete;
  }

  return defaultAuth;
};
