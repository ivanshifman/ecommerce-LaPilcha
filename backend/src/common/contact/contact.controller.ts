import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { SendContactDto } from '../dto/send-contact.dto';
import { OptionalJwtAuthGuard } from '../../cart/guards/optional-jwt-auth.guard';
import { AuthenticatedUserDto } from '../../auth/dto/authenticated-user.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendContactMessage(@Body() dto: SendContactDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUserDto | undefined;

    const contactData = {
      name: dto.name,
      email: user ? user.email : dto.email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      isAuthenticated: !!user,
      userId: user?.id,
    };

    await this.mailService.sendContactForm(contactData);

    return {
      success: true,
      message: 'Mensaje enviado correctamente',
    };
  }
}
