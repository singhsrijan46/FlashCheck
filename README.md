# Flash Check - Movie Ticket Booking System

## Project Title
**Flash Check** - A Modern Movie Ticket Booking Platform

## Project Description
Flash Check is a full-stack web application that provides a seamless movie ticket booking experience. Built with React.js frontend and Node.js backend, it offers users the ability to browse movies, select showtimes, book seats, and manage their bookings. The platform features an intuitive admin dashboard for theatre and show management, real-time seat availability, and integrated payment processing.

The application integrates with TMDB API for movie data and trailers, provides email notifications for bookings, and offers a responsive design that works across all devices. With features like advanced search filters, booking management, and cancellation policies, Flash Check delivers a complete movie ticket booking solution.

## Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400/9333ea/ffffff?text=Flash+Check+Home+Page)

### Movie Details
![Movie Details](https://via.placeholder.com/800x400/9333ea/ffffff?text=Movie+Details+Page)

### Seat Selection
![Seat Selection](https://via.placeholder.com/800x400/9333ea/ffffff?text=Seat+Selection+Interface)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400/9333ea/ffffff?text=Admin+Dashboard)

### Booking Management
![Booking Management](https://via.placeholder.com/800x400/9333ea/ffffff?text=Booking+Management)

## Hosted URL
**Frontend:** https://flashcheck-client.vercel.app  
**Backend:** https://flashcheck-server.vercel.app/

## Features Implemented

### Frontend
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Movie Browsing**: Browse movies with detailed information and trailers
- **Advanced Search**: Filter movies by genre, language, format, and rating
- **Showtime Selection**: View available showtimes by date and theatre
- **Interactive Seat Layout**: Visual seat selection with real-time availability
- **Booking Management**: View and manage user bookings
- **Payment Integration**: Secure payment processing with Stripe
- **User Authentication**: Login/register with JWT tokens
- **Admin Dashboard**: Complete theatre and show management
- **Contact Management**: Admin interface for managing user inquiries
- **Real-time Updates**: Live seat availability and booking status
- **Email Notifications**: Booking confirmations and cancellations
- **Responsive Navigation**: Mobile-friendly navigation with hamburger menu
- **Loading States**: Smooth loading animations and error handling
- **Toast Notifications**: User-friendly success/error messages

### Backend
- **RESTful API**: Complete CRUD operations for all entities
- **User Authentication**: JWT-based authentication and authorization
- **Admin Authorization**: Role-based access control for admin features
- **Movie Management**: Integration with TMDB API for movie data
- **Show Management**: Create, update, and manage movie shows
- **Theatre Management**: Multi-screen theatre administration
- **Booking System**: Complete booking lifecycle management
- **Payment Processing**: Stripe integration for secure payments
- **Email Service**: Automated email notifications using Nodemailer
- **Database Management**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling and validation
- **API Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Configuration**: Flexible environment variable management
- **Contact Form Processing**: Store and manage user inquiries
- **Cancellation System**: Booking cancellation with refund processing
- **Search and Filtering**: Advanced search capabilities
- **Data Caching**: Optimized performance with caching strategies

## Technologies/Libraries/Packages Used

### Frontend
- **React.js** - Frontend framework
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **CSS3** - Styling with custom CSS
- **Context API** - State management
- **React Hooks** - Functional components and state
- **Responsive Design** - Mobile-first CSS approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **TMDB API** - Movie data integration
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### Development Tools
- **Git** - Version control
- **npm** - Package manager
- **ESLint** - Code linting
- **Vercel** - Deployment platform
- **Postman** - API testing
- **MongoDB Atlas** - Cloud database

## Local Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/flash-check.git
   cd flash-check
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Environment Configuration (Frontend)**
   Create `.env` file in the client directory:
   ```env
   VITE_BASE_URL=http://localhost:8080
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
   ```

6. **Start Development Servers**
   
   **Backend:**
   ```bash
   cd server
   npm start
   ```
   
   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Database Setup
1. Create a MongoDB database (local or Atlas)
2. Update the `MONGODB_URI` in your `.env` file
3. The application will automatically create collections on first run

### API Keys Setup
1. **TMDB API**: Get your API key from [TMDB](https://www.themoviedb.org/settings/api)
2. **Stripe**: Create a Stripe account and get your API keys
3. **Email**: Configure SMTP settings for email notifications

## Team Members

### Development Team
- **Srijan Singh** - MERN Developer
  - Frontend Development (React.js)
  - Backend Development (Node.js/Express)
  - Database Design (MongoDB)
  - API Integration
  - UI/UX Design
  - Payment Integration
  - Email Service Implementation

### Project Roles
- **Lead Developer**: Srijan
- **UI/UX Designer**: Srijan
- **Backend Developer**: Srijan
- **Frontend Developer**: Srijan
- **DevOps**: Srijan

## Demo Video
**Demo Video Link:** [Flash Check Demo](https://www.youtube.com/watch?v=your-demo-video-id)

### Video Content
- Project overview and features
- User registration and authentication
- Movie browsing and search functionality
- Showtime selection and seat booking
- Payment processing demonstration
- Admin dashboard walkthrough
- Booking management features
- Mobile responsiveness showcase

---

## Additional Information

### Project Structure
```
flash-check/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── assets/        # Static assets
│   │   └── lib/          # Utility functions
│   └── public/           # Public assets
├── server/                # Backend Node.js application
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   └── configs/         # Configuration files
└── README.md            # Project documentation
```

### License
This project is licensed under the MIT License.

### Support
For support and questions, please contact: singhsrijangkp@gmail.com
