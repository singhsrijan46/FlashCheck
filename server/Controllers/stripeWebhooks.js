import stripe from "stripe";
import Booking from '../models/Booking.js'
import sendEmail from "../configs/nodeMailer.js";

export const stripeWebhooks = async (request, response)=>{
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const session = sessionList.data[0];
                const { bookingId } = session.metadata;

                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                })

                // Send confirmation email
                try {
                    const booking = await Booking.findById(bookingId).populate({
                        path: 'show',
                        populate: {path: "movie", model: "Movie"}
                    }).populate('user');

                    if (booking && booking.user && booking.show) {
                        await sendEmail({
                            to: booking.user.email,
                            subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
                            body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
                                <h2>Hi ${booking.user.name},</h2>
                                <p>Your booking for <strong style="color: #1E90FF;">"${booking.show.movie.title}"</strong> is confirmed.</p>
                                <p>
                                    <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
                                    <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
                                </p>
                                <p>Enjoy the show! 🍿</p>
                                <p>Thanks for booking with us!<br/>— FlashCheck Team</p>
                            </div>`
                        });
                        console.log('Confirmation email sent successfully');
                    }
                } catch (error) {
                    console.log('Email confirmation failed:', error.message);
                    // Don't fail the webhook if email fails
                }

                break;
            }
        
            default:
                console.log('Unhandled event type:', event.type)
        }
        response.json({received: true})
    } catch (err) {
        console.error("Webhook processing error:", err);
        response.status(500).send("Internal Server Error");
    }
}