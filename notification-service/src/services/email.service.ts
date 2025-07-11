import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { EmailNotificationDto } from '../dto/email-notification.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  
  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    if (process.env.NODE_ENV === 'development') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: parseInt(process.env.SMTP_PORT) || 2525,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Môi trường production - dùng Gmail hoặc SendGrid
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
    }
    this.logger.log('Email transporter setup complete');
  }

  async sendEmail(emailData: EmailNotificationDto): Promise<void> {
    try {
      const html = await this.renderTemplate(emailData.template, emailData.data);

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'E-commerce Shop <noreply@ecommerce.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${emailData.to}, messageId: ${result.messageId}`);

    } catch (error) {
      this.logger.error(`Failed to send email to ${emailData.to}`, error);
      throw error;
    }
  }

  private async renderTemplate(templateName: string, data: any): Promise<string> {
    try {
      const templatePath = path.join(__dirname, '../../templates', `${templateName}.hbs`);
      
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template ${templateName} not found at ${templatePath}`);
      }

      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(templateContent);
      return template(data);
    } catch (error) {
      this.logger.error(`Failed to render template ${templateName}`, error);
      throw error;
    }
  }
  
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email connection failed', error);
      return false;
    }
  }
}