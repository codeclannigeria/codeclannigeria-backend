export const Authenticate = (
  isAuthenticationEnabled: boolean,
  decorator: MethodDecorator
): MethodDecorator => {
  return (target, key: string | symbol, value: any): any => {
    if (isAuthenticationEnabled) {
      decorator(target, key, value);
    }
  };
};
