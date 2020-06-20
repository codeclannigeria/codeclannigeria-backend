export const Authenticate = (
  isAuthEnable: boolean,
  decorator: MethodDecorator
): MethodDecorator => {
  return (target, key: string | symbol, value: any): any => {
    if (isAuthEnable) {
      decorator(target, key, value);
    }
  };
};
