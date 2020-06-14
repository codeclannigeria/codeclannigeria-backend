import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { LoginReqDto } from '../auth/models/dto/auth.dto';
import { MailService } from '../mail/mail.service';
import { ApiException } from '../shared/models/api-exception.model';
import { TokenType } from '../shared/models/temporary-token.entity';
import { RegisterUserDto } from '../users/models/dto/register-user.dto';
import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guards/auth.guard';
import { AcctVerifyDto } from './models/dto/acct-verification.dto';
import { ResetPassInput } from './models/dto/reset-pw.dto';
import { ValidateTokenInput } from './models/dto/validate-token.dto';
import configuration from 'src/shared/config/configuration';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: ApiException })
  @UseGuards(AuthenticationGuard)
  async login(@Body() _: LoginReqDto, @Req() req: Request) {
    req.user;
    return this.authService.login(req.user as User);
  }
  @Post('register')
  async register(@Body() input: RegisterUserDto): Promise<string> {
    const exist = await this.usersService.findOneAsync({ email: input.email });
    if (exist)
      throw new ConflictException('User with the email already exists');
    const user = this.usersService.createEntity(input);
    await this.usersService.insertAsync(user);
    return user.id;
  }

  @Post('send-email-confirmation-token')
  @ApiOkResponse()
  async sendEmailVerifyToken(@Body() input: AcctVerifyDto) {
    const { clientBaseUrl, tokenParamName, emailParamName, email } = input;

    const exist = await this.usersService.findOneAsync({ email });
    if (!exist) throw new NotFoundException('User with email does not exist');
    if (exist.isEmailVerified)
      throw new BadRequestException('Email has already been confirmed');
    const token = await this.authService.generateTempToken(
      exist.id,
      TokenType.EMAIL,
      60 * 24,
    );
    if (!token) return;
    const url = new URL(clientBaseUrl);
    url.searchParams.set(tokenParamName, token);
    url.searchParams.set(emailParamName, email);
    const html = `<p>Hello ${exist.fullName}, please confirm your email <a href=${url.href}>here</a></p>`;
    this.mailService.sendMailAsync({
      from: configuration().appEmail,
      to: exist.email,
      html,
      date: new Date(Date.now()),
    });
  }
  @Post('send-password-reset-token')
  @ApiOkResponse()
  async sendForgotPwToken(@Body() input: AcctVerifyDto) {
    const { clientBaseUrl, tokenParamName, emailParamName, email } = input;

    const exist = await this.usersService.findOneAsync({ email });
    if (!exist)
      throw new NotAcceptableException('User with email does not exist');
    const token = await this.authService.generateTempToken(
      exist.id,
      TokenType.PASSWORD,
      10,
    );
    if (!token) return;
    const url = new URL(clientBaseUrl);
    url.searchParams.set(tokenParamName, token);
    url.searchParams.set(emailParamName, email);
    const html = `<p>Hello ${exist.fullName}, please reset your password <a href=${url.href}>here</a></p>`;
    this.mailService.sendMailAsync({
      from: configuration().appEmail,
      to: exist.email,
      html,
      date: new Date(Date.now()),
    });
  }
  @Post('confirm-email')
  @ApiOkResponse()
  async verifyEmailToken(@Body() input: ValidateTokenInput) {
    const { email, token } = input;
    const exist = await this.usersService.findOneAsync({ email });
    if (!exist) throw new NotFoundException('User does not exist');
    if (exist.isEmailVerified)
      throw new BadRequestException('Email already verified');
    await this.authService.validateEmailToken({
      userId: exist.id,
      plainToken: token,
    });
  }
  @Post('reset-password')
  @ApiOkResponse()
  async resetPassword(@Body() input: ResetPassInput) {
    const { email, token, newPassword } = input;
    const exist = await this.usersService.findOneAsync({ email });
    if (!exist) throw new UnauthorizedException('Password reset failed');
    await this.authService.validatePasswordToken({
      userId: exist.id,
      plainToken: token,
      newPassword,
    });
  }
}
