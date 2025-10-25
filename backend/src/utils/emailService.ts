import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@interviewscheduling.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendInterviewScheduledEmail(
    candidateEmail: string,
    candidateName: string,
    interviewerName: string,
    interviewTitle: string,
    startTime: Date,
    endTime: Date,
    videoLink?: string
  ): Promise<void> {
    const subject = `Interview Scheduled: ${interviewTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Interview Scheduled</h2>
        <p>Dear ${candidateName},</p>
        <p>Your interview has been successfully scheduled:</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Title:</strong> ${interviewTitle}</p>
          <p><strong>Interviewer:</strong> ${interviewerName}</p>
          <p><strong>Date & Time:</strong> ${startTime.toLocaleString()}</p>
          <p><strong>Duration:</strong> ${Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutes</p>
          ${videoLink ? `<p><strong>Video Link:</strong> <a href="${videoLink}">${videoLink}</a></p>` : ''}
        </div>
        <p>Please be available 5 minutes before the scheduled time.</p>
        <p>If you need to reschedule, please contact us as soon as possible.</p>
        <p>Best regards,<br>Interview Scheduling Team</p>
      </div>
    `;

    await this.sendEmail({
      to: candidateEmail,
      subject,
      html
    });
  }

  async sendInterviewReminderEmail(
    candidateEmail: string,
    candidateName: string,
    interviewTitle: string,
    startTime: Date,
    videoLink?: string
  ): Promise<void> {
    const subject = `Interview Reminder: ${interviewTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Interview Reminder</h2>
        <p>Dear ${candidateName},</p>
        <p>This is a reminder for your upcoming interview:</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Title:</strong> ${interviewTitle}</p>
          <p><strong>Time:</strong> ${startTime.toLocaleString()}</p>
          ${videoLink ? `<p><strong>Video Link:</strong> <a href="${videoLink}">${videoLink}</a></p>` : ''}
        </div>
        <p>Please ensure you have a stable internet connection and are in a quiet environment.</p>
        <p>Best regards,<br>Interview Scheduling Team</p>
      </div>
    `;

    await this.sendEmail({
      to: candidateEmail,
      subject,
      html
    });
  }

  async sendInterviewCancelledEmail(
    candidateEmail: string,
    candidateName: string,
    interviewTitle: string,
    reason?: string
  ): Promise<void> {
    const subject = `Interview Cancelled: ${interviewTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Interview Cancelled</h2>
        <p>Dear ${candidateName},</p>
        <p>We regret to inform you that the following interview has been cancelled:</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Title:</strong> ${interviewTitle}</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        </div>
        <p>If you would like to reschedule, please contact us.</p>
        <p>Best regards,<br>Interview Scheduling Team</p>
      </div>
    `;

    await this.sendEmail({
      to: candidateEmail,
      subject,
      html
    });
  }

  async sendInterviewerNotificationEmail(
    interviewerEmail: string,
    interviewerName: string,
    candidateName: string,
    interviewTitle: string,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    const subject = `New Interview Scheduled: ${interviewTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Interview Scheduled</h2>
        <p>Dear ${interviewerName},</p>
        <p>A new interview has been scheduled for you:</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Title:</strong> ${interviewTitle}</p>
          <p><strong>Candidate:</strong> ${candidateName}</p>
          <p><strong>Date & Time:</strong> ${startTime.toLocaleString()}</p>
          <p><strong>Duration:</strong> ${Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutes</p>
        </div>
        <p>Please review the candidate's profile and prepare accordingly.</p>
        <p>Best regards,<br>Interview Scheduling Team</p>
      </div>
    `;

    await this.sendEmail({
      to: interviewerEmail,
      subject,
      html
    });
  }
}

export const emailService = new EmailService();
