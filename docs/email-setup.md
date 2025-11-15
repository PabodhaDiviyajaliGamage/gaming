# Email Configuration Guide

This project uses Nodemailer to send automated email notifications for orders.

## Setup Instructions

### 1. Gmail Setup (Recommended)

If you're using Gmail, follow these steps:

1. **Enable 2-Step Verification**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security > 2-Step Verification
   - Follow the steps to enable it

2. **Create an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "SL Gaming Hub"
   - Click "Generate"
   - Copy the 16-character password (format: xxxx-xxxx-xxxx-xxxx)

3. **Update .env File**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ADMIN_EMAIL=your-email@gmail.com
   ```

### 2. Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

#### Custom SMTP Server
```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

## Email Notifications

### When Orders Are Created
- **To Customer**: Order confirmation with details
- **To Admin**: New order notification

### When Orders Are Completed
- **To Customer**: Order completed notification
- **To Admin**: Order completion confirmation

## Testing Email Configuration

To test if your email configuration is working:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Create a test order through the website

3. Check your email inbox for:
   - Customer confirmation email
   - Admin notification email

4. Check the console logs for any email errors

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables**
   - Ensure all EMAIL_* variables are set in `.env`
   - Verify EMAIL_PASSWORD is correct (use app password for Gmail)

2. **Check Console Logs**
   - Look for error messages in the terminal
   - Common errors: authentication failed, connection timeout

3. **Gmail Specific Issues**
   - Make sure 2-Step Verification is enabled
   - Use App Password, not your regular password
   - Check "Less secure app access" is NOT needed (we use App Passwords)

4. **Firewall/Network Issues**
   - Ensure port 587 is not blocked
   - Try using port 465 with `EMAIL_SECURE=true`

### Emails Going to Spam

- Add proper SPF records to your domain
- Use a verified email address
- Ask recipients to mark emails as "Not Spam"

## Security Notes

- Never commit the `.env` file to Git
- Use App Passwords instead of regular passwords
- Keep your email credentials secure
- Consider using environment-specific configurations for production

## Production Deployment

For production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform's dashboard
2. Use a dedicated email service for better deliverability:
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

## Support

If you encounter issues:
1. Check the console logs
2. Verify your email credentials
3. Test with a simple SMTP test tool
4. Contact your email provider's support
