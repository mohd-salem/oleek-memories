import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, fileId, downloadUrl, filename } = await request.json();

    console.log('📨 Notify API called:', { email, fileId, filename, hasDownloadUrl: !!downloadUrl });

    if (!email || !downloadUrl) {
      console.error('❌ Missing required parameters:', { email: !!email, downloadUrl: !!downloadUrl });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('🚀 Sending email via Resend...');
    
    const result = await resend.emails.send({
      from: 'OLEEK <info@oleek.us>',
      to: email,
      subject: 'Your Video is Ready! 🎥',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37;">Your video conversion is complete!</h1>
          <p>Your video has been successfully converted and is ready to download.</p>
          <p style="margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="background-color: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Download ${filename}
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            <strong>Note:</strong> This download link will expire in 24 hours for your security.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was sent because you used the OLEEK video converter.<br>
            We never store your videos or share your email address.
          </p>
        </div>
      `,
    });

    console.log('✅ Resend response:', result);

    return NextResponse.json({
      success: true,
      message: 'Email notification sent',
      emailId: result.data?.id,
    });
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
