import { UserRole } from '../../users/models/user.entity';
import {
  ControllerAuth,
  DefaultAuthObject
} from '../interfaces/default-auth-object.interface';

const defaultAuth: ControllerAuth = {
  create: {
    enableAuth: true,
    authRoles: []
  },
  update: {
    enableAuth: true,
    authRoles: []
  },
  find: {
    enableAuth: true,
    authRoles: []
  },
  findById: {
    enableAuth: true,
    authRoles: []
  },
  delete: {
    enableAuth: true,
    authRoles: []
  }
};

export const getAuthObj = (
  authObj: DefaultAuthObject | boolean
): ControllerAuth => {
  const roles = Object.values(UserRole);
  defaultAuth.create.authRoles = roles;
  defaultAuth.update.authRoles = roles;
  defaultAuth.find.authRoles = roles;
  defaultAuth.findById.authRoles = roles;
  defaultAuth.delete.authRoles = roles;

  if (typeof authObj === 'boolean') {
    if (authObj === false) {
      defaultAuth.create.enableAuth = false;
      defaultAuth.update.enableAuth = false;
      defaultAuth.find.enableAuth = false;
      defaultAuth.findById.enableAuth = false;
      defaultAuth.delete.enableAuth = false;
      return defaultAuth;
    }
    return defaultAuth;
  }

  if (typeof authObj?.find === 'boolean') {
    defaultAuth.find.enableAuth = authObj.find;
  } else if (!!authObj?.find?.length) {
    defaultAuth.find.authRoles = authObj.find;
  }

  if (typeof authObj?.findById === 'boolean') {
    defaultAuth.findById.enableAuth = authObj.findById;
  } else if (!!authObj?.findById?.length) {
    defaultAuth.findById.authRoles = authObj.findById;
  }

  if (typeof authObj?.update === 'boolean') {
    defaultAuth.update.enableAuth = authObj.update;
  } else if (!!authObj?.update?.length) {
    defaultAuth.update.authRoles = authObj.update;
  }

  if (typeof authObj?.create === 'boolean') {
    defaultAuth.create.enableAuth = authObj.create;
  } else if (!!authObj?.create?.length) {
    defaultAuth.create.authRoles = authObj.create;
  }

  if (typeof authObj?.delete === 'boolean') {
    defaultAuth.delete.enableAuth = authObj.delete;
  } else if (!!authObj?.delete?.length) {
    defaultAuth.delete.authRoles = authObj.delete;
  }

  return defaultAuth;
};
