# 🎬 Movie Ticket Booking System

A full-stack web application for booking movie tickets with real-time seat selection, payment processing, and admin management features.

## 🌟 Features

### 🎯 User Features
- **Movie Discovery**: Browse movies by city with real-time availability
- **Showtime Selection**: View available showtimes with language and format options
- **Interactive Seat Booking**: Real-time seat selection with visual layout
- **Secure Payments**: Stripe integration for secure payment processing
- **Booking Management**: View and manage your bookings
- **Ticket Cancellation**: Cancel tickets with refund processing
- **Movie Trailers**: Watch trailers for movies currently playing
- **Advanced Search**: Filter movies by language, genre, format, and rating
- **City-based Content**: Location-specific movie listings and showtimes

### 🔧 Admin Features
- **Show Management**: Add, edit, and manage movie shows
- **Theatre Management**: Add and manage theatres and screens
- **Booking Analytics**: View booking statistics and reports
- **User Management**: Monitor user activities and bookings
- **Real-time Updates**: Instant updates to show availability

### 🎨 UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Dark Theme**: Eye-friendly dark mode design
- **Loading States**: Smooth loading experiences
- **Toast Notifications**: Real-time feedback for user actions

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Context API**: Global state management
- **Axios**: HTTP client for API communication
- **Stripe**: Payment processing integration
- **Lucide React**: Modern icon library

### Backend (Node.js + Express)
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Secure authentication and authorization
- **Stripe**: Payment processing and webhooks
- **TMDB API**: Movie data and trailer integration
- **Nodemailer**: Email notifications
- **QR Code**: Ticket QR code generation

## 📁 Project Structure

```
movieTicket/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   │   └── admin/     # Admin panel pages
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utility libraries
│   │   └── assets/        # Static assets
│   ├── public/            # Public assets
│   └── package.json
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── configs/          # Configuration files
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- TMDB API key
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movieTicket
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   **Backend (.env)**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env)**
   ```bash
   cd client
   cp env.example .env
   ```
   
   Update the `.env` file:
   ```env
   VITE_BASE_URL=http://localhost:8080
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
   VITE_CURRENCY=$
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   cd server
   npm run server
   
   # Start frontend server (in a new terminal)
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 📊 Database Models

### User
- Authentication details
- Booking history
- Role-based access (user/admin)

### Movie
- Movie information from TMDB API
- Poster and backdrop images
- Genre and rating data

### Theatre
- Theatre details and location
- Screen information
- Operating hours

### Show
- Movie showtimes
- Language and format options
- Pricing tiers (Silver, Gold, Diamond)
- Seat availability

### Booking
- User booking details
- Seat information
- Payment status
- QR code for tickets

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login

### Movies & Shows
- `GET /api/show/city/:city` - Get movies by city
- `GET /api/show/city/:city/trailers` - Get trailers for city
- `GET /api/show/:movieId/city/:city` - Get shows by movie and city
- `GET /api/show/:movieId/trailer` - Get movie trailer

### Bookings
- `POST /api/booking/create` - Create booking
- `GET /api/booking/user/:userId` - Get user bookings
- `POST /api/booking/cancel` - Cancel booking

### Admin
- `POST /api/show/add` - Add new show
- `POST /api/theatre/add` - Add new theatre
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/shows` - Get all shows

### Payments
- `POST /api/payment/create-payment-intent` - Create payment
- `POST /api/payment/webhook` - Stripe webhook handler

## 🎨 Key Components

### Frontend Components
- **ChromaMovieCard**: Animated movie cards with hover effects
- **SeatLayout**: Interactive seat selection interface
- **TrailersSection**: Movie trailer carousel
- **PaymentForm**: Secure payment processing
- **CitySelector**: Location-based content filtering

### Backend Services
- **TMDB Integration**: Movie data and trailer fetching
- **Stripe Integration**: Payment processing and webhooks
- **Email Service**: Booking confirmations and notifications
- **QR Code Generation**: Digital ticket generation

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Request data sanitization
- **Rate Limiting**: API abuse prevention
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Vercel Deployment
The project is configured for Vercel deployment with:
- Automatic builds and deployments
- Environment variable management
- Serverless functions
- CDN for static assets

### Environment Variables for Production
Set the following environment variables in your Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `TMDB_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`

## 🧪 Testing

### Manual Testing
1. **User Registration/Login**: Test authentication flow
2. **Movie Browsing**: Test city-based movie discovery
3. **Seat Booking**: Test seat selection and booking process
4. **Payment Processing**: Test Stripe payment integration
5. **Admin Functions**: Test show and theatre management

### API Testing
Use tools like Postman or Thunder Client to test API endpoints:
- Authentication endpoints
- Movie and show endpoints
- Booking endpoints
- Admin endpoints

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB URI in environment variables
   - Ensure MongoDB service is running
   - Verify network connectivity

2. **TMDB API Errors**
   - Verify TMDB API key is correct
   - Check API rate limits
   - Ensure proper API key permissions

3. **Stripe Payment Issues**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Ensure proper currency settings

4. **CORS Errors**
   - Check FRONTEND_URL environment variable
   - Verify CORS configuration in server.js
   - Ensure proper domain settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB**: For movie data and trailer APIs
- **Stripe**: For payment processing
- **Vercel**: For hosting and deployment
- **React Community**: For excellent documentation and tools

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Made with ❤️ by the Movie Ticket Booking Team**
