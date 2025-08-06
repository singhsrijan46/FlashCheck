# 📧 Email Setup Guide for MovieTicket

This guide will help you set up email functionality for booking confirmations and welcome emails.

## 🔧 Step 1: Gmail App Password Setup

### For Gmail Users:

1. **Enable 2-Factor Authentication:**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to Google Account settings
   - Navigate to Security > 2-Step Verification
   - Click on "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "MovieTicket" as the name
   - Copy the generated 16-character password

## 🔧 Step 2: Environment Variables

Add these variables to your `server/.env` file:

```env
# Email Configuration
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SENDER_EMAIL=your_email@gmail.com
```

### Example:
```env
SMTP_USER=movieticket@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SENDER_EMAIL=movieticket@gmail.com
```

## 🔧 Step 3: Alternative Email Providers

### For Outlook/Hotmail:
```env
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
SENDER_EMAIL=your_email@outlook.com
```

### For Yahoo:
```env
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_app_password
SENDER_EMAIL=your_email@yahoo.com
```

## 🔧 Step 4: Testing Email Configuration

1. **Start the server:**
   ```bash
   cd server
   npm start
   ```

2. **Register a new user** or **make a booking** to test emails

3. **Check server logs** for email status:
   ```
   ✅ Booking confirmation email sent successfully
   📧 Email sent to: user@example.com
   📧 Message ID: <message-id>
   ```

## 📧 Email Features

### ✅ Booking Confirmation Email
- **When sent:** After successful payment and booking
- **Includes:**
  - Booking ID
  - Movie details
  - Theatre and screen information
  - Show date and time
  - Selected seats
  - Payment status
  - Important information

### ✅ Welcome Email
- **When sent:** After user registration
- **Includes:**
  - Welcome message
  - Basic information about the platform

## 🚨 Troubleshooting

### Issue: "Email configuration not found"
**Solution:** Make sure all email environment variables are set in your `.env` file.

### Issue: "Authentication failed"
**Solution:** 
- Check your email and password
- For Gmail, use App Password instead of regular password
- Enable "Less secure app access" (not recommended for production)

### Issue: "Connection timeout"
**Solution:**
- Check your internet connection
- Verify email provider settings
- Try different email provider

## 🔒 Security Notes

1. **Never commit email credentials** to version control
2. **Use App Passwords** instead of regular passwords
3. **Enable 2-Factor Authentication** for better security
4. **Use environment variables** for all sensitive data

## 📱 Email Templates

The system includes beautiful HTML email templates with:
- Responsive design
- Professional styling
- Booking details
- Important information
- Contact details

## 🎯 Next Steps

1. Set up your email credentials
2. Test with a booking
3. Check your email for confirmation
4. Customize email templates if needed

## 📞 Support

If you encounter issues:
1. Check server logs for error messages
2. Verify email configuration
3. Test with different email providers
4. Contact support if needed 