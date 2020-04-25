import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthReqDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class AuthResDto {
  accessToken: string;
  expireInSeconds: number;
  userId: string;
}
