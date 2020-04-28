import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginReqDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class LoginResDto {
  accessToken: string;
  expireInSeconds: number;
  userId: string;
}
