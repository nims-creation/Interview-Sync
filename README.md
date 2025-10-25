# Interview Scheduling Platform

A full-stack web application for managing interview scheduling between candidates and interviewers, built with React, Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

### For Candidates
- **User Registration & Authentication** - Secure signup/login with JWT tokens
- **Google OAuth Integration** - Quick sign-in with Google accounts
- **Interview Booking** - Browse and book available time slots
- **Dashboard** - View upcoming and past interviews
- **Interview Management** - Cancel interviews when needed
- **Video Conferencing** - Automatic video link generation for interviews

### For Interviewers
- **Availability Management** - Create and manage time slots
- **Interview Dashboard** - View scheduled interviews and statistics
- **Slot Management** - Add, edit, or delete availability slots
- **Email Notifications** - Get notified when interviews are booked

### For Administrators
- **User Management** - View all users and their roles
- **Analytics Dashboard** - Comprehensive statistics and insights
- **System Overview** - Monitor interviews, users, and system health

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email notifications
- **Joi** for validation
- **Winston** for logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Interview-Dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/interview_scheduling

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@interviewsync.com
```

### 3. Database Setup

```bash
# Seed the database with sample data
npm run seed
```

This will create:
- Admin user: `admin@interviewsync.com` / `admin123`
- Sample interviewers with availability slots
- Sample candidates

### 4. Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### 5. Frontend Setup

```bash
cd ../project
npm install
```

### 6. Start Frontend Server

```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎯 Usage

### Default Login Credentials

**Admin User:**
- Email: `admin@interviewsync.com`
- Password: `admin123`

**Sample Interviewers:**
- Email: `john.smith@company.com` | Password: `interviewer123`
- Email: `sarah.johnson@company.com` | Password: `interviewer123`
- Email: `mike.davis@company.com` | Password: `interviewer123`

### Getting Started

1. **Register/Login** - Create an account or use existing credentials
2. **Set Up Availability** (Interviewers) - Create time slots for interviews
3. **Book Interviews** (Candidates) - Browse and book available slots
4. **Manage Interviews** - View, cancel, or update interviews
5. **Monitor System** (Admins) - Use the admin dashboard for oversight

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get all users (Admin only)

### Interviews
- `GET /api/interviews` - Get user's interviews
- `POST /api/interviews` - Create new interview (Candidates)
- `GET /api/interviews/:id` - Get specific interview
- `PUT /api/interviews/:id` - Update interview (Interviewers/Admins)
- `PATCH /api/interviews/:id/cancel` - Cancel interview
- `DELETE /api/interviews/:id` - Delete interview (Interviewers/Admins)

### Slots
- `GET /api/slots` - Get available slots
- `POST /api/slots` - Create new slot (Interviewers/Admins)
- `GET /api/slots/:id` - Get specific slot
- `PUT /api/slots/:id` - Update slot (Interviewers/Admins)
- `DELETE /api/slots/:id` - Delete slot (Interviewers/Admins)

### Google OAuth
- `POST /api/google/google` - Google OAuth authentication

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Role-based Access Control** - Different permissions for different user types
- **Input Validation** - Joi schemas for request validation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Protection** - Configured for specific origins
- **Helmet** - Security headers

## 📧 Email Notifications

The system automatically sends email notifications for:
- Interview scheduled (to candidate and interviewer)
- Interview cancelled (to candidate)
- Interview reminders (configurable)

Configure email settings in the `.env` file to enable notifications.

## 🎥 Video Conferencing

- **Automatic Link Generation** - Jitsi Meet links created for each interview
- **Easy Access** - One-click access to video meetings
- **Secure Rooms** - Unique room names for each interview

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd project
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update API URLs for production

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/interview_scheduling` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | `7d` |
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:5173` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `EMAIL_HOST` | SMTP host for emails | No | - |
| `EMAIL_USER` | SMTP username | No | - |
| `EMAIL_PASS` | SMTP password | No | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added email notifications and video conferencing
- **v1.2.0** - Enhanced security and error handling

---

Built with ❤️ for efficient interview scheduling