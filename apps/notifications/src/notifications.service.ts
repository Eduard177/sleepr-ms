import { Injectable } from '@nestjs/common';
import { NotifyEmailDTO } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly trasnport = nodemailer.createTransport({
    host: this.configService.getOrThrow('SMTP_HOST'),
    port: this.configService.getOrThrow('SMTP_PORT'),
    secure: false,
  });
  async notifyEmail({ email, text }: NotifyEmailDTO) {
    await this.trasnport.sendMail({
      from: this.configService.getOrThrow('SMTP_USER'),
      to: email,
      subject: 'Sleepr Notificiation',
      text,
    });
  }
}
