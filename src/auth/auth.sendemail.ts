import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'indietrackeri@gmail.com',
        pass: '@Nadhirbarhoumi23', // Use an App Password if 2FA is enabled
      },
    });
  }

  async sendVerificationEmail(email: string, userId: string) {
    const verificationLink = `http://localhost:3001/verify-email?token=${userId}`;

    const mailOptions = {
      from: 'indietrackeri@gmail.com', // Should match `auth.user`
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
