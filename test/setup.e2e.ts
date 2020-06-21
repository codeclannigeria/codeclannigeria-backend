process.env.JWT_VALIDITY_HOURS = '24';
process.env.JWT_SECRET = 'JWT_SECRET';

jest.mock('~shared/utils/random-token', () => ({
  generateRandomToken: () => 'token'
}));
// jest.mock('~shared/mail/mail.service', () => ({
//   sendMailAsync: () => Promise.resolve()
// }));

// jest
//   .spyOn(ContextIdFactory, 'getByRequest')
//   .mockImplementation(() => ContextIdFactory.create());
