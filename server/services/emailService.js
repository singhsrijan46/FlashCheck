import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Email template for booking confirmation
const createBookingEmailTemplate = (bookingData) => {
    const {
        userName,
        movieTitle,
        theatreName,
        screen,
        format,
        showDateTime,
        bookedSeats,
        amount,
        bookingId,
        paymentStatus
    } = bookingData;

    const formattedDate = new Date(showDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = new Date(showDateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - MovieTicket</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .email-container {
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #10B981;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #10B981;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            .booking-details {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #495057;
            }
            .detail-value {
                color: #212529;
            }
            .seats-section {
                background-color: #e8f5e8;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
            .seats-title {
                font-weight: 600;
                color: #10B981;
                margin-bottom: 10px;
            }
            .seat-item {
                display: inline-block;
                background-color: #10B981;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                margin: 2px;
                font-size: 14px;
            }
            .payment-section {
                background-color: #fff3cd;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
            .payment-status {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }
            .status-success {
                background-color: #d4edda;
                color: #155724;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #666;
                font-size: 14px;
            }
            .contact-info {
                margin-top: 15px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🎬 MovieTicket</div>
                <div class="subtitle">Your Booking Confirmation</div>
            </div>

            <h2>Hello ${userName}!</h2>
            <p>Thank you for booking with MovieTicket. Your booking has been confirmed!</p>

            <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${bookingId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Movie:</span>
                    <span class="detail-value">${movieTitle}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Theatre:</span>
                    <span class="detail-value">${theatreName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Screen:</span>
                    <span class="detail-value">${screen}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Format:</span>
                    <span class="detail-value">${format}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">$${amount}</span>
                </div>
            </div>

            <div class="seats-section">
                <div class="seats-title">🎫 Your Seats</div>
                ${bookedSeats.map(seat => `<span class="seat-item">${seat}</span>`).join(' ')}
            </div>

            <div class="payment-section">
                <h3>💳 Payment Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span class="payment-status status-success">${paymentStatus}</span>
                </div>
                <p><strong>Payment Method:</strong> Credit/Debit Card (via Stripe)</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📝 Important Information</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Please arrive at least 15 minutes before the show time</li>
                    <li>Bring a valid ID for verification</li>
                    <li>Seats are non-refundable and non-transferable</li>
                    <li>Mobile phones should be switched off during the movie</li>
                    <li>Food and beverages from outside are not allowed</li>
                </ul>
            </div>

            <div class="footer">
                <p>Thank you for choosing MovieTicket!</p>
                <p>Enjoy your movie experience! 🎬</p>
                <div class="contact-info">
                    <p>For any queries, please contact us at support@movieticket.com</p>
                    <p>© 2024 MovieTicket. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (bookingData) => {
    try {
        // Check if email configuration is available
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            // console.log('⚠️ Email configuration not found. Skipping email send.');
            return {
                success: false,
                message: 'Email configuration not available'
            };
        }

        const transporter = createTransporter();
        const emailTemplate = createBookingEmailTemplate(bookingData);

        const mailOptions = {
            from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
            to: bookingData.userEmail,
            subject: `Booking Confirmation - ${bookingData.movieTitle}`,
            html: emailTemplate
        };

        const info = await transporter.sendMail(mailOptions);
        
        // console.log('✅ Booking confirmation email sent successfully');
        // console.log('📧 Email sent to:', bookingData.userEmail);
        // console.log('📧 Message ID:', info.messageId);

        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        // console.error('❌ Error sending booking confirmation email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Email template for booking cancellation
const createCancellationEmailTemplate = (cancellationData) => {
    const {
        userName,
        movieTitle,
        theatreName,
        screen,
        format,
        showDateTime,
        bookedSeats,
        amount,
        bookingId,
        refundAmount,
        refundId
    } = cancellationData;

    const formattedDate = new Date(showDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = new Date(showDateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancellation - MovieTicket</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .email-container {
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #EF4444;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #EF4444;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            .cancellation-details {
                background-color: #fef2f2;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #EF4444;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #495057;
            }
            .detail-value {
                color: #212529;
            }
            .refund-section {
                background-color: #f0fdf4;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #10B981;
            }
            .refund-title {
                font-weight: 600;
                color: #10B981;
                margin-bottom: 10px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #666;
                font-size: 14px;
            }
            .contact-info {
                margin-top: 15px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🎬 MovieTicket</div>
                <div class="subtitle">Booking Cancellation Confirmation</div>
            </div>

            <h2>Hello ${userName}!</h2>
            <p>Your booking has been successfully cancelled. We're sorry to see you go!</p>

            <div class="cancellation-details">
                <h3>📋 Cancelled Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${bookingId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Movie:</span>
                    <span class="detail-value">${movieTitle}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Theatre:</span>
                    <span class="detail-value">${theatreName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Screen:</span>
                    <span class="detail-value">${screen}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Format:</span>
                    <span class="detail-value">${format}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Show Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Show Time:</span>
                    <span class="detail-value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cancelled Seats:</span>
                    <span class="detail-value">${bookedSeats.join(', ')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Original Amount:</span>
                    <span class="detail-value">$${amount}</span>
                </div>
            </div>

            <div class="refund-section">
                <div class="refund-title">💰 Refund Information</div>
                <div class="detail-row">
                    <span class="detail-label">Refund Amount:</span>
                    <span class="detail-value">$${refundAmount}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Refund ID:</span>
                    <span class="detail-value">${refundId || 'Processing...'}</span>
                </div>
                <p><strong>Note:</strong> The refund will be processed to your original payment method within 5-7 business days.</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📝 Important Information</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Your seats have been released and are now available for other customers</li>
                    <li>The refund will be processed to your original payment method</li>
                    <li>Refund processing time: 5-7 business days</li>
                    <li>You can book new tickets anytime through our platform</li>
                </ul>
            </div>

            <div class="footer">
                <p>Thank you for using MovieTicket!</p>
                <p>We hope to see you again soon! 🎬</p>
                <div class="contact-info">
                    <p>For any queries, please contact us at support@movieticket.com</p>
                    <p>© 2024 MovieTicket. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Send cancellation email
export const sendCancellationEmail = async (cancellationData) => {
    try {
        // Check if email configuration is available
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            // console.log('⚠️ Email configuration not found. Skipping email send.');
            return {
                success: false,
                message: 'Email configuration not available'
            };
        }

        const transporter = createTransporter();
        const emailTemplate = createCancellationEmailTemplate(cancellationData);

        const mailOptions = {
            from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
            to: cancellationData.userEmail,
            subject: `Booking Cancelled - ${cancellationData.movieTitle}`,
            html: emailTemplate
        };

        const info = await transporter.sendMail(mailOptions);
        
        // console.log('✅ Cancellation email sent successfully');
        // console.log('📧 Email sent to:', cancellationData.userEmail);
        // console.log('📧 Message ID:', info.messageId);

        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        // console.error('❌ Error sending cancellation email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Send welcome email (optional)
export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return {
                success: false,
                message: 'Email configuration not available'
            };
        }

        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
            to: userEmail,
            subject: 'Welcome to MovieTicket! 🎬',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #10B981;">Welcome to MovieTicket!</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for joining MovieTicket! We're excited to have you on board.</p>
                    <p>Start exploring the latest movies and book your tickets today!</p>
                    <p>Best regards,<br>The MovieTicket Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        // console.log('✅ Welcome email sent successfully');
        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        // console.error('❌ Error sending welcome email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export default {
    sendBookingConfirmationEmail,
    sendWelcomeEmail
}; 