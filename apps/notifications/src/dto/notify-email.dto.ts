import { IsEmail, IsString } from 'class-validator';

export class NotifyEmailDTO {
  @IsEmail()
  email: string;

  @IsString
  text: string;
}
