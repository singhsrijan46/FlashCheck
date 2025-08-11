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
const createBookingEmailTemplate = async (bookingData) => {
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
        <title>Booking Confirmation - Flash Check</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .email-container {
                background: linear-gradient(145deg, #010915, rgba(14, 20, 47, 0.9733));
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(147, 51, 234, 0.3);
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #9333ea;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #9333ea;
                margin-bottom: 10px;
                text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
            }
            .subtitle {
                color: #d1d5db;
                font-size: 16px;
            }
            h2 {
                color: white;
                margin-bottom: 15px;
            }
            p {
                color: #d1d5db;
                margin-bottom: 15px;
            }
            .booking-details {
                background: rgba(147, 51, 234, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .booking-details h3 {
                color: #9333ea;
                margin-bottom: 15px;
                font-size: 18px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(147, 51, 234, 0.2);
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #9333ea;
            }
            .detail-value {
                color: #d1d5db;
            }
            .seats-section {
                background: rgba(147, 51, 234, 0.1);
                border-radius: 12px;
                padding: 15px;
                margin: 20px 0;
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .seats-title {
                font-weight: 600;
                color: #9333ea;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .seat-item {
                display: inline-block;
                background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                margin: 2px;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
            }
            .payment-section {
                background: rgba(147, 51, 234, 0.1);
                border-radius: 12px;
                padding: 15px;
                margin: 20px 0;
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .payment-section h3 {
                color: #9333ea;
                margin-bottom: 15px;
                font-size: 16px;
            }
            .payment-status {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }
            .status-success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            }
            .important-info {
                background: rgba(147, 51, 234, 0.1);
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .important-info h3 {
                color: #9333ea;
                margin-bottom: 15px;
                font-size: 16px;
            }
            .important-info ul {
                margin: 0;
                padding-left: 20px;
                color: #d1d5db;
            }
            .important-info li {
                margin-bottom: 8px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(147, 51, 234, 0.2);
                color: #d1d5db;
                font-size: 14px;
            }
            .contact-info {
                margin-top: 15px;
                font-size: 12px;
                color: #9ca3af;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🎬 Flash Check</div>
                <div class="subtitle">Your Booking Confirmation</div>
            </div>

            <h2>Hello ${userName}!</h2>
            <p>Thank you for booking with Flash Check. Your booking has been confirmed!</p>

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
                <p style="color: #d1d5db;"><strong>Payment Method:</strong> Credit/Debit Card (via Stripe)</p>
            </div>



            <div class="important-info">
                <h3>📝 Important Information</h3>
                <ul>
                    <li>Please arrive at least 15 minutes before the show time</li>
                    <li>Bring a valid ID for verification</li>
                    <li>Seats are non-refundable and non-transferable</li>
                    <li>Mobile phones should be switched off during the movie</li>
                    <li>Food and beverages from outside are not allowed</li>
                </ul>
            </div>

            <div class="footer">
                <p>Thank you for choosing Flash Check!</p>
                <p>Enjoy your movie experience! 🎬</p>
                <div class="contact-info">
                    <p>For any queries, please contact us at support@flashcheck.com</p>
                    <p>© 2024 Flash Check. All rights reserved.</p>
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

            return {
                success: false,
                message: 'Email configuration not available'
            };
        }

        const transporter = createTransporter();
        const emailTemplate = await createBookingEmailTemplate(bookingData);

        const mailOptions = {
            from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
            to: bookingData.userEmail,
            subject: `Booking Confirmed - ${bookingData.movieTitle}`,
            html: emailTemplate
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Email template for booking cancellation
const createCancellationEmailTemplate = async (cancellationData) => {
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
        <title>Booking Cancellation - Flash Check</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .email-container {
                background: linear-gradient(145deg, #010915, rgba(14, 20, 47, 0.9733));
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(147, 51, 234, 0.3);
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #9333ea;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #9333ea;
                margin-bottom: 10px;
                text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
            }
            .subtitle {
                color: #d1d5db;
                font-size: 16px;
            }
            h2 {
                color: white;
                margin-bottom: 15px;
            }
            p {
                color: #d1d5db;
                margin-bottom: 15px;
            }
            .cancellation-details {
                background: rgba(239, 68, 68, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.2);
            }
            .cancellation-details h3 {
                color: #ef4444;
                margin-bottom: 15px;
                font-size: 18px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(147, 51, 234, 0.2);
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #9333ea;
            }
            .detail-value {
                color: #d1d5db;
            }
            .refund-section {
                background: rgba(16, 185, 129, 0.1);
                border-radius: 12px;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #10b981;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }
            .refund-title {
                font-weight: 600;
                color: #10b981;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .refund-amount {
                font-size: 24px;
                font-weight: bold;
                color: #10b981;
                margin: 10px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(147, 51, 234, 0.2);
                color: #d1d5db;
                font-size: 14px;
            }
            .contact-info {
                margin-top: 15px;
                font-size: 12px;
                color: #9ca3af;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🎬 Flash Check</div>
                <div class="subtitle">Booking Cancellation</div>
            </div>

            <h2>Hello ${userName}!</h2>
            <p>Your booking with Flash Check has been successfully cancelled. We're sorry to see you go!</p>

            <div class="cancellation-details">
                <h3>❌ Cancelled Booking Details</h3>
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
                    <span class="detail-label">Original Amount:</span>
                    <span class="detail-value">$${amount}</span>
                </div>
            </div>

            <div class="refund-section">
                <div class="refund-title">💰 Refund Information</div>
                <div class="refund-amount">$${refundAmount}</div>
                <p style="color: #d1d5db; margin: 10px 0;"><strong>Refund ID:</strong> ${refundId}</p>
                <p style="color: #d1d5db; margin: 10px 0;">Your refund will be processed within 5-7 business days to your original payment method.</p>
            </div>



            <div class="footer">
                <p>Thank you for choosing Flash Check!</p>
                <p>We hope to see you again soon! 🎬</p>
                <div class="contact-info">
                    <p>For any queries, please contact us at support@flashcheck.com</p>
                    <p>© 2024 Flash Check. All rights reserved.</p>
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
        const emailTemplate = await createCancellationEmailTemplate(cancellationData);

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
            subject: 'Welcome to Flash Check! 🎬',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Flash Check</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .email-container {
                        background: linear-gradient(145deg, #010915, rgba(14, 20, 47, 0.9733));
                        border-radius: 15px;
                        padding: 30px;
                        box-shadow: 0 20px 40px rgba(147, 51, 234, 0.3);
                        border: 1px solid rgba(147, 51, 234, 0.2);
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #9333ea;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo {
                        font-size: 28px;
                        font-weight: bold;
                        color: #9333ea;
                        margin-bottom: 10px;
                        text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
                    }
                    .subtitle {
                        color: #d1d5db;
                        font-size: 16px;
                    }
                    h2 {
                        color: white;
                        margin-bottom: 15px;
                        text-align: center;
                    }
                    p {
                        color: #d1d5db;
                        margin-bottom: 15px;
                        text-align: center;
                    }
                    .welcome-section {
                        background: rgba(147, 51, 234, 0.1);
                        border-radius: 12px;
                        padding: 20px;
                        margin: 20px 0;
                        border: 1px solid rgba(147, 51, 234, 0.2);
                        text-align: center;
                    }
                    .features {
                        background: rgba(147, 51, 234, 0.1);
                        border-radius: 12px;
                        padding: 20px;
                        margin: 20px 0;
                        border: 1px solid rgba(147, 51, 234, 0.2);
                    }
                    .features h3 {
                        color: #9333ea;
                        margin-bottom: 15px;
                        text-align: center;
                        font-size: 18px;
                    }
                    .feature-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    .feature-list li {
                        color: #d1d5db;
                        margin-bottom: 10px;
                        padding: 8px 0;
                        border-bottom: 1px solid rgba(147, 51, 234, 0.2);
                    }
                    .feature-list li:last-child {
                        border-bottom: none;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 600;
                        margin: 20px 0;
                        box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
                        transition: all 0.3s ease;
                    }
                    .cta-button:hover {
                        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 30px rgba(147, 51, 234, 0.4);
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid rgba(147, 51, 234, 0.2);
                        color: #d1d5db;
                        font-size: 14px;
                    }
                    .contact-info {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #9ca3af;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <div class="logo">🎬 Flash Check</div>
                        <div class="subtitle">Welcome to the Ultimate Movie Experience</div>
                    </div>

                    <h2>Welcome, ${userName}! 🎉</h2>
                    <p>Thank you for joining Flash Check! We're excited to have you on board.</p>

                    <div class="welcome-section">
                        <p>Get ready to discover amazing movies and book your tickets with ease!</p>
                    </div>

                    <div class="features">
                        <h3>🌟 What You Can Do</h3>
                        <ul class="feature-list">
                            <li>🎬 Browse the latest movies and upcoming releases</li>
                            <li>🎫 Book tickets for your favorite movies</li>
                            <li>🏪 Choose from multiple theatres and screens</li>
                            <li>💺 Select your preferred seats</li>
                            <li>💳 Secure payment with multiple options</li>
                            <li>📧 Get instant booking confirmations</li>
                            <li>⭐ Rate and review movies</li>
                            <li>📱 Mobile-friendly experience</li>
                        </ul>
                    </div>

                    <div style="text-align: center;">
                        <a href="http://localhost:3000/movies" class="cta-button">Start Exploring Movies</a>
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing Flash Check!</p>
                        <p>Enjoy your movie experience! 🎬</p>
                        <div class="contact-info">
                            <p>For any queries, please contact us at support@flashcheck.com</p>
                            <p>© 2024 Flash Check. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
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

// Send contact confirmation email
export const sendContactConfirmationEmail = async (contactData) => {
    try {
        // Check if email configuration is available
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return {
                success: false,
                message: 'Email configuration not available'
            };
        }

        const transporter = createTransporter();
        const emailTemplate = createContactConfirmationTemplate(contactData);

        const mailOptions = {
            from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
            to: contactData.userEmail,
            subject: 'Thank you for contacting Flash Check! 📧',
            html: emailTemplate
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Contact confirmation email template
const createContactConfirmationTemplate = (contactData) => {
    const { userName, userEmail, message } = contactData;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Confirmation - Flash Check</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .email-container {
                background: linear-gradient(145deg, #010915, rgba(14, 20, 47, 0.9733));
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(147, 51, 234, 0.3);
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #9333ea;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #9333ea;
                margin-bottom: 10px;
                text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
            }
            .subtitle {
                color: #d1d5db;
                font-size: 16px;
            }
            h2 {
                color: white;
                margin-bottom: 15px;
            }
            p {
                color: #d1d5db;
                margin-bottom: 15px;
            }
            .message-details {
                background: rgba(147, 51, 234, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                border: 1px solid rgba(147, 51, 234, 0.2);
            }
            .message-details h3 {
                color: #9333ea;
                margin-bottom: 15px;
                font-size: 18px;
            }
            .message-content {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
                border-left: 4px solid #9333ea;
                font-style: italic;
                color: #d1d5db;
            }
            .next-steps {
                background: rgba(16, 185, 129, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }
            .next-steps h3 {
                color: #10b981;
                margin-bottom: 15px;
                font-size: 16px;
            }
            .next-steps ul {
                margin: 0;
                padding-left: 20px;
                color: #d1d5db;
            }
            .next-steps li {
                margin-bottom: 8px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(147, 51, 234, 0.2);
                color: #d1d5db;
                font-size: 14px;
            }
            .contact-info {
                margin-top: 15px;
                font-size: 12px;
                color: #9ca3af;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🎬 Flash Check</div>
                <div class="subtitle">Message Received</div>
            </div>

            <h2>Hello ${userName}!</h2>
            <p>Thank you for reaching out to Flash Check. We have received your message and will get back to you as soon as possible.</p>

            <div class="message-details">
                <h3>📧 Your Message Details</h3>
                <div class="message-content">
                    "${message}"
                </div>
                <p><strong>From:</strong> ${userEmail}</p>
                <p><strong>Received:</strong> ${new Date().toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</p>
            </div>

            <div class="next-steps">
                <h3>🔄 What Happens Next?</h3>
                <ul>
                    <li>Our support team will review your message within 24 hours</li>
                    <li>You'll receive a detailed response via email</li>
                    <li>For urgent matters, we may contact you directly</li>
                    <li>We aim to resolve all inquiries within 48 hours</li>
                </ul>
            </div>

            <div class="footer">
                <p>Thank you for choosing Flash Check!</p>
                <p>We appreciate your patience and look forward to assisting you! 🎬</p>
                <div class="contact-info">
                    <p>For urgent matters, please contact us at support@flashcheck.com</p>
                    <p>© 2024 Flash Check. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default {
    sendBookingConfirmationEmail,
    sendWelcomeEmail,
    sendContactConfirmationEmail
}; 