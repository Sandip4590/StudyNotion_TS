import config from '@/config';
import { logger } from '@/lib/winston';
import { stringify } from 'node:querystring';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

type MailData = {
  email: string;
  title: string;
  body: string
  | Number;

};

const mailSender = async ({ email, title, body }: MailData) => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: config.MAIL_HOST,
      port: Number(config.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });

    const info: SentMessageInfo = await transporter.sendMail({
      from: `Mail Send by Sendy`,
      to: email,
      subject: title,
      html: String(body),
    });

    logger.info('Verification email sent', { to: email });
    return { success: true, info };
  } catch (error) {
    logger.error('Failed to send verification email', { to: email, error });
    return { success: false };
  }
};

export default mailSender;
