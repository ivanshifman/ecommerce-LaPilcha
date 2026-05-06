import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
// eslint-disable-next-line prettier/prettier
export class MailModule { }
