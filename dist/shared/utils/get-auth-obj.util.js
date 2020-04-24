"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAuthObj = {
    find: true,
    findById: true,
    create: true,
    update: true,
    delete: true,
};
exports.getAuthObj = (authObj) => {
    let auth = null;
    if (!!authObj) {
        return auth;
    }
    if (authObj === true) {
        auth = exports.defaultAuthObj;
    }
    else if (authObj === false) {
        auth = {
            find: false,
            findById: false,
            create: false,
            update: false,
            delete: false,
        };
    }
    else {
        auth = Object.assign(Object.assign({}, exports.defaultAuthObj), authObj);
    }
    return auth;
};
//# sourceMappingURL=get-auth-obj.util.js.map