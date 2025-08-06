// Test email functionality
import dotenv from 'dotenv';
import { sendBookingConfirmationEmail, sendWelcomeEmail } from './services/emailService.js';

dotenv.config();

const testEmailFunctionality = async () => {
    console.log('=== TESTING EMAIL FUNCTIONALITY ===');
    
    // Check environment variables
    console.log('\n🔍 Checking email configuration...');
    console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Not set');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Not set');
    console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL ? '✅ Set' : '❌ Not set');
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('\n❌ Email configuration incomplete!');
        console.log('Please set SMTP_USER and SMTP_PASS in your .env file');
        console.log('See EMAIL_SETUP_GUIDE.md for instructions');
        return;
    }
    
    // Test welcome email
    console.log('\n📧 Testing welcome email...');
    const welcomeResult = await sendWelcomeEmail('test@example.com', 'Test User');
    
    if (welcomeResult.success) {
        console.log('✅ Welcome email test successful');
        console.log('📧 Message ID:', welcomeResult.messageId);
    } else {
        console.log('❌ Welcome email test failed:', welcomeResult.message);
    }
    
    // Test booking confirmation email
    console.log('\n📧 Testing booking confirmation email...');
    const bookingData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        movieTitle: 'Test Movie',
        theatreName: 'Test Theatre',
        screen: 'Screen 1',
        format: '2D',
        showDateTime: new Date('2025-08-10T14:00:00.000Z'),
        bookedSeats: ['A1', 'A2', 'A3'],
        amount: 150,
        bookingId: 'test-booking-id',
        paymentStatus: 'succeeded'
    };
    
    const bookingResult = await sendBookingConfirmationEmail(bookingData);
    
    if (bookingResult.success) {
        console.log('✅ Booking confirmation email test successful');
        console.log('📧 Message ID:', bookingResult.messageId);
    } else {
        console.log('❌ Booking confirmation email test failed:', bookingResult.message);
    }
    
    console.log('\n=== EMAIL TEST COMPLETE ===');
    console.log('\n📝 Next steps:');
    console.log('1. Check your email for test messages');
    console.log('2. If emails are received, configuration is working');
    console.log('3. If not, check the error messages above');
    console.log('4. Refer to EMAIL_SETUP_GUIDE.md for troubleshooting');
};

testEmailFunctionality().catch(console.error); 