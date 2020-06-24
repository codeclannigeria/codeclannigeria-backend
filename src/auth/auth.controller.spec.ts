import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { MailService } from '../shared/mail/mail.service';
import { RegisterUserDto } from '../users/models/dto/register-user.dto';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginReqDto } from './models/dto/auth.dto';

process.env.JWT_VALIDITY_HOURS = '24';
process.env.JWT_SECRET = 'secrete';

jest.mock('../users/users.service');
jest.mock('./temp-token.service');
jest.mock('./auth.service');

describe('Auth Controller', () => {
  let controller: AuthController;
  let usersService: UsersService;
  const authService: any = {};

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, MailService]
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(MailService)
      .useValue({ sendMailAsync: () => Promise.resolve() })

      .compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  let input: RegisterUserDto;
  describe('Sign up', () => {
    input = {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'email@gmail.com',
      password: '123qwe!'
    };
    it('should register a user', async () => {
      usersService.createEntity = jest.fn().mockReturnValue('user');
      usersService.insertAsync = jest
        .fn()
        .mockResolvedValue({ isEmailVerified: false });
      const { canLogin } = await controller.register(input);
      expect(canLogin).toBe(false);
    });
    it("should register a user that doesn't need verification", async () => {
      usersService.insertAsync = jest
        .fn()
        .mockResolvedValueOnce({ isEmailVerified: true });
      const { canLogin } = await controller.register({
        ...input,
        email: 'email2@gmail.com'
      });
      expect(canLogin).toBe(true);
    });
    it(`should throw ${ConflictException.name} if user already exist`, async () => {
      usersService.findOneAsync = jest.fn().mockResolvedValue('user');
      await expect(controller.register(input)).rejects.toThrowError(
        ConflictException
      );
      usersService.findOneAsync = jest.fn();
    });
  });
  describe('Login', () => {
    it(`should throw ${UnauthorizedException.name} for incorrect password`, async () => {
      const loginInput: LoginReqDto = {
        email: input.email,
        password: 'incorrect!P@ss'
      };
      authService.getAuthToken = () =>
        Promise.reject(new UnauthorizedException());

      await expect(
        controller.login(loginInput, { user: 'user' } as any)
      ).rejects.toThrowError(UnauthorizedException);
    });
    it(`should throw ${UnauthorizedException.name} for incorrect email`, async () => {
      const loginInput: LoginReqDto = {
        email: 'incorrect@email.com',
        password: input.password
      };
      await expect(
        controller.login(loginInput, { user: 'user' } as any)
      ).rejects.toThrowError(UnauthorizedException);
    });
    it('should return JWT on successful login', async () => {
      const loginInput: LoginReqDto = {
        email: input.email,
        password: input.password
      };
      authService.getAuthToken = () =>
        Promise.resolve({ accessToken: 'token' });

      const { accessToken } = await controller.login(loginInput, {
        user: 'user'
      } as any);
      expect(accessToken).toBeTruthy();
    });
  });
});
