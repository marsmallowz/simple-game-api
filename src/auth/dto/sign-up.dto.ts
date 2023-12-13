import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  username: string;

  @MinLength(8)
  password: string;

  @MinLength(8)
  rePassword: string;
}
