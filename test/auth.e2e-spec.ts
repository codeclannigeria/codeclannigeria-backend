import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthModule } from '../src/auth/auth.module';
import { LoginReqDto } from '../src/auth/models/dto/auth.dto';
import { ResetPassInput } from '../src/auth/models/dto/reset-pw.dto';
import { ValidateTokenInput } from '../src/auth/models/dto/validate-token.dto';
import { MailService } from '../src/shared/mail/mail.service';
import { RegisterUserDto } from '../src/users/models/dto/register-user.dto';
import { DbTest } from './db-test.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let route: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, DbTest]
    })
      .overrideProvider(MailService)
      .useValue({ sendMailAsync: () => Promise.resolve() })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      })
    );

    await app.init();
    route = request(app.getHttpServer());
  });

  let registerInput: RegisterUserDto;
  const validEmail = 'valid@gmail.com';
  const validPass = '123@qWe^7';

  // Sign Up
  describe('/auth/register/ (POST)', () => {
    registerInput = {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: validEmail,
      password: validPass
    };
    it('should return 400 for invalid request', () => {
      return route
        .post('/auth/register')
        .send({ ...registerInput, email: '' })
        .expect(400);
    });
    it('should register user and return 201', async () => {
      const { body } = await route
        .post('/auth/register')
        .send(registerInput)
        .expect(201);

      expect(body).toEqual({ canLogin: false });
    });
    it('should return 409 for existing customer', () => {
      return route.post('/auth/register').send(registerInput).expect(409);
    });
  });

  // Authentication
  describe('/auth/login (POST)', () => {
    const loginInput = (({ email, password }) => ({ email, password }))(
      registerInput
    );
    it('should return 200 for valid login input', async () => {
      const { body } = await route
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      expect(body.accessToken).toBeTruthy();
    });
    it('should return 401 for incorrect login input', async () => {
      return route
        .post('/auth/login')
        .send({ ...loginInput, password: 'invalidP@3s' })
        .expect(401);
    });
  });

  const verificationInput = {
    clientBaseUrl: 'https://www.google.com',
    tokenParamName: 'token',
    emailParamName: 'email',
    email: validEmail
  };
  // Send Email Confirmation
  describe('/auth/send-email-confirmation-token (POST)', () => {
    const endpoint = '/auth/send-email-confirmation-token';
    it('should send email confirmation token for valid details', () => {
      return route.post(endpoint).send(verificationInput).expect(200);
    });
    it('should return 404 for incorrect details', () => {
      return route
        .post(endpoint)
        .send({ ...verificationInput, email: 'invalid@email.com' })
        .expect(404);
    });
  });

  // Confirm Email
  describe('/auth/confirm-email (POST)', () => {
    const endpoint = '/auth/confirm-email';
    const input: ValidateTokenInput = {
      email: validEmail,
      token: 'token'
    };
    it('should return forbidden for invalid token details', async () => {
      return route
        .post(endpoint)
        .send({ ...input, token: 'invalid' })
        .expect(HttpStatus.FORBIDDEN);
    });
    it('should confirm email for valid details', async () => {
      return route.post(endpoint).send(input).expect(200);
    });
    it('should return conflict for an already verified email', async () => {
      return route.post(endpoint).send(input).expect(409);
    });

    it('should return 409 for user that already verified', () => {
      return route.post(endpoint).send(input).expect(409);
    });
  });

  // Send password reset token
  describe('/auth/send-password-reset-token (POST)', () => {
    const endpoint = '/auth/send-password-reset-token';
    it('should send password reset token for valid details', () => {
      return route.post(endpoint).send(verificationInput).expect(200);
    });
    it('should return 200 for incorrect details for security reasons', () => {
      return route
        .post(endpoint)
        .send({ ...verificationInput, email: 'invalid@email.com' })
        .expect(200);
    });
  });

  // Reset Password
  describe('/auth/reset-password (POST)', () => {
    const endpoint = '/auth/reset-password';
    const input: ResetPassInput = {
      email: validEmail,
      token: 'token',
      newPassword: 'n3wP@ss0rd'
    };
    it('should return forbidden for invalid token details', async () => {
      return route
        .post(endpoint)
        .send({ ...input, token: 'invalid' })
        .expect(HttpStatus.FORBIDDEN);
    });
    it('should return 401 for non-existent user', () => {
      return route
        .post(endpoint)
        .send({ ...input, email: 'invalid@gmail.com' })
        .expect(401);
    });
    it('should reset password for valid details', async () => {
      return route.post(endpoint).send(input).expect(200);
    });
    describe('/auth/login (POST) - After password reset', () => {
      const loginInput: LoginReqDto = {
        email: validEmail,
        password: input.newPassword
      };
      it('should return 401 when using old password to login', async () => {
        return route
          .post('/auth/login')
          .send({ ...loginInput, password: validPass })
          .expect(401);
      });
      it('should return 200 when using new password to login', async () => {
        return route.post('/auth/login').send(loginInput).expect(200);
      });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
