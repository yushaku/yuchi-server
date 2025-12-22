import { Resend } from 'resend';
import { env } from '@/config/env';

// Create Resend client instance
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

/**
 * Send OTP code to email using Resend
 */
export async function sendOtpEmail(email: string, code: string): Promise<void> {
  // If Resend is not configured, fall back to console logging
  if (!resend || !env.RESEND_API_KEY) {
    console.log('\n📧 OTP Email (Resend not configured - Development Mode)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${email}`);
    console.log(`Subject: Your login code`);
    console.log(`Code: ${code}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 To enable Resend, set RESEND_API_KEY in your .env file');
    console.log('   Get your API key from: https://resend.com/api-keys');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Your Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Login Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 1 minute.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error(`Failed to send OTP email: ${JSON.stringify(error)}`);
    }

    console.log(`✅ OTP email sent to ${email} via Resend`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
}
