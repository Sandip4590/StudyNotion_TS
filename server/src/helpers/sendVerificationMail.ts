import { logger } from '@/lib/winston';
import mailSender from '@/utils/mailSender';

export async function sendVerificationMail(
  email: string,
  otp: Number,
 
): Promise<void> {
  try {
    const mailResponse = await mailSender({
      email,
      title: 'Verification Mail from Sendy',
      body: otp,
    });

    logger.info('Verfication Mail Sent SuccessFully', {
      to: email,
      responseId: mailResponse.info?.messageId,
    });
  } catch (error) {
    logger.error('Failed To Send Verification Mail', { to: email, error });
  }
}
