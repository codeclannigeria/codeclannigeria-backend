export const Authorize = (
  isAuthorizationEnabled: boolean,
  decorator: MethodDecorator
): MethodDecorator => {
  return (target, key: string | symbol, value: any): any => {
    if (isAuthorizationEnabled) {
      decorator(target, key, value);
    }
  };
};
