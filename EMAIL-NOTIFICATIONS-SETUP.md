# Email Notifications Setup

## Feature Overview

Users can now optionally provide their email address when converting videos. Once the conversion is complete, they'll receive an email with a download link.

## Current Implementation

The feature is **fully integrated** but email sending is currently **logged to console**. To enable actual email sending, you need to set up an email service provider.

## Recommended: Resend (Easy Setup)

### 1. Install Resend

```bash
npm install resend
```

### 2. Get API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use `onboarding@resend.dev` for testing)
3. Get your API key from the dashboard

### 3. Add to .env.local

```env
RESEND_API_KEY=re_123456789
```

### 4. Update `/src/app/api/notify/route.ts`

Replace the TODO section with:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, fileId, downloadUrl, filename } = await request.json();

    if (!email || !downloadUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'OLEEK <noreply@yourdomain.com>',
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

    return NextResponse.json({
      success: true,
      message: 'Email notification sent',
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
```

## Alternative: AWS SES

If you're already using AWS:

### 1. Install AWS SES SDK

```bash
npm install @aws-sdk/client-ses
```

### 2. Verify Email in AWS SES Console

1. Go to AWS SES Console
2. Verify your sender email address
3. Request production access (or stay in sandbox for testing)

### 3. Update `/src/app/api/notify/route.ts`

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, downloadUrl, filename } = await request.json();

    const command = new SendEmailCommand({
      Source: 'noreply@yourdomain.com',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Your Video is Ready! 🎥',
        },
        Body: {
          Html: {
            Data: `...HTML template...`,
          },
        },
      },
    });

    await sesClient.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
```

## Testing Without Email Service

The feature works now! Emails are logged to console:

```bash
📧 Email notification: {
  to: 'user@example.com',
  subject: 'Your video conversion is complete!',
  downloadUrl: 'https://...',
  filename: 'video-converted.mp4'
}
```

Check your terminal when a conversion completes with an email address provided.

## Features Included

✅ Optional email input field  
✅ Email stored with job  
✅ Automatic notification on completion  
✅ Email only sent once per conversion  
✅ Download link included  
✅ Graceful fallback if email fails  
✅ Privacy-focused messaging  

## Privacy Notes

- Email is optional (users can still download directly)
- No email validation required (you can add later)
- Emails are not stored permanently (only in memory with job)
- Clear privacy messaging: "no spam, ever"
- Download links expire in 24 hours (S3 lifecycle policy)

## Production Checklist

- [ ] Set up Resend or AWS SES
- [ ] Verify sender domain
- [ ] Add API keys to production environment
- [ ] Test email delivery
- [ ] Monitor email send failures
- [ ] Consider adding email validation
- [ ] Add unsubscribe link (if building email list)
