import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { LoginReqDto } from '../auth/models/dto/auth.dto';
import { MailService } from '../mail/mail.service';
import configuration from '../shared/config/configuration';
import { ApiException } from '../shared/models/api-exception.model';
import { TokenType } from '../shared/models/temporary-token.entity';
import { RegisterUserDto } from '../users/models/dto/register-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guards/auth.guard';
import { AcctVerifyDto } from './models/dto/acct-verification.dto';
import { ResetPassInput } from './models/dto/reset-pw.dto';
import { ValidateTokenInput } from './models/dto/validate-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: ApiException })
  @UseGuards(AuthenticationGuard)
  async login(@Body() input: LoginReqDto): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.login(
      input.email,
      input.password
    );
    return { accessToken };
  }
  @Post('register')
  @ApiConflictResponse({ type: ApiException })
  async register(
    @Body() input: RegisterUserDto
  ): Promise<{ canLogin: boolean }> {
    const exist = await this.usersService.findOneAsync({ email: input.email });
    if (exist)
      throw new ConflictException('User with the email already exists');
    const user = this.usersService.createEntity(input);
    const saved = await this.usersService.insertAsync(user);
    return { canLogin: saved.isEmailVerified };
  }

  @Post('send-email-confirmation-token')
  @HttpCode(HttpStatus.OK)
  async sendEmailVerifyToken(@Body() input: AcctVerifyDto): Promise<void> {
    const { clientBaseUrl, tokenParamName, emailParamName, email } = input;
    const user = await this.usersService.findOneAsync({ email });
    if (!user) throw new NotFoundException('User with email does not exist');
    if (user.isEmailVerified)
      throw new ConflictException('Email has already been confirmed');
    const token = await this.authService.generateTempToken({
      user,
      type: TokenType.EMAIL,
      expiresInMins: 60 * 24
    });
    if (!token) return;
    const url = new URL(clientBaseUrl);
    url.searchParams.set(tokenParamName, token);
    url.searchParams.set(emailParamName, email);
    const html = `<p>Hello ${user.fullName}, please confirm your email <a href=${url.href}>here</a></p>`;
    this.mailService.sendMailAsync({
      from: configuration().appEmail,
      to: user.email,
      html,
      date: new Date(Date.now())
    });
  }
  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmailToken(@Body() input: ValidateTokenInput): Promise<void> {
    const { email, token } = input;
    const user = await this.usersService.findOneAsync({ email });
    if (!user) throw new NotFoundException('User does not exist');
    if (user.isEmailVerified)
      throw new ConflictException('Email already verified');
    await this.authService.validateEmailToken({
      userId: user.id,
      plainToken: token
    });
  }
  @Post('send-password-reset-token')
  @HttpCode(HttpStatus.OK)
  async sendForgotPwToken(@Body() input: AcctVerifyDto): Promise<void> {
    const { clientBaseUrl, tokenParamName, emailParamName, email } = input;

    const user = await this.usersService.findOneAsync({ email });
    if (!user) return;
    const token = await this.authService.generateTempToken({
      user,
      type: TokenType.PASSWORD,
      expiresInMins: 10
    });
    if (!token) return;
    const url = new URL(clientBaseUrl);
    url.searchParams.set(tokenParamName, token);
    url.searchParams.set(emailParamName, email);
    const html = `<p>Hello ${user.fullName}, please reset your password <a href=${url.href}>here</a></p>`;
    this.mailService.sendMailAsync({
      from: configuration().appEmail,
      to: user.email,
      html,
      date: new Date(Date.now())
    });
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() input: ResetPassInput): Promise<void> {
    const { email, token, newPassword } = input;
    const exist = await this.usersService.findOneAsync({ email });
    if (!exist) throw new UnauthorizedException('Password reset failed');
    await this.authService.validatePasswordToken({
      userId: exist.id,
      plainToken: token,
      newPassword
    });
  }
}
