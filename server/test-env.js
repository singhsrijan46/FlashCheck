import 'dotenv/config';

console.log('=== Environment Variables Test ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY ? '✅ Set' : '❌ Missing');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing');
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL ? '✅ Set' : '❌ Missing');
console.log('================================'); 