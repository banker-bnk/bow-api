import { Injectable, Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sendpulse = require('sendpulse-api');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private isInitialized = false;

  constructor() {
    this.initializeSendPulse();
  }

  private initializeSendPulse() {
    const apiUserId = process.env.SENDPULSE_API_USER_ID;
    const apiSecret = process.env.SENDPULSE_API_SECRET;
    const tokenStorage = '/tmp/';

    if (!apiUserId || !apiSecret) {
      this.logger.error('SendPulse credentials not configured');
      return;
    }

    sendpulse.init(apiUserId, apiSecret, tokenStorage, () => {
      this.isInitialized = true;
      this.logger.log('SendPulse initialized successfully');
    });
  }

  async sendPaymentConfirmation(
    toEmail: string,
    userName: string,
    amount: number,
    currency: string,
  ): Promise<void> {
    if (!this.isInitialized) {
      this.logger.warn('SendPulse not initialized, skipping email');
      return;
    }

    const fromEmail = process.env.SENDPULSE_FROM_EMAIL;
    const fromName = process.env.SENDPULSE_FROM_NAME || 'Bow';

    if (!fromEmail) {
      this.logger.error('SENDPULSE_FROM_EMAIL not configured');
      return;
    }

    const email = {
      subject: 'Payment Confirmation',
      template: {
        id: '49200',
        variables: {
          user: userName,
          amount: amount.toString(),
          currency: currency,
        },
      },
      from: {
        name: fromName,
        email: fromEmail,
      },
      to: [
        {
          email: toEmail,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      sendpulse.smtpSendMail(
        (data) => {
          if (data?.result === true) {
            this.logger.log(`Email sent successfully to ${toEmail}`);
            resolve();
          } else {
            this.logger.error('Failed to send email', data);
            reject(new Error('Failed to send email'));
          }
        },
        email,
      );
    });
  }
}

