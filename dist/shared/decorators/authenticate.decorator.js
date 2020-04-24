"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = (isAuthEnable, decorator) => {
    return (target, key, value) => {
        if (isAuthEnable) {
            decorator(target, key, value);
        }
    };
};
//# sourceMappingURL=authenticate.decorator.js.map