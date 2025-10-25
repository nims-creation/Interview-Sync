# Interview Scheduling Platform - Backend

A modern, secure, and scalable backend for the Interview Scheduling Platform built with Node.js, Express, TypeScript, and Prisma.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Candidate, Interviewer, Admin)
- **Interview Management**: Full CRUD operations for interviews with conflict checking
- **Slot Management**: Time slot creation and management for interviewers
- **Email Notifications**: Automated emails for interview scheduling, reminders, and cancellations
- **Security**: Rate limiting, input validation, CORS, helmet security headers
- **Error Handling**: Comprehensive error handling for all types of errors
- **Database**: PostgreSQL with Prisma ORM
- **Logging**: Winston-based logging for production monitoring

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Joi
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Interview-Dashboard/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/interview_scheduling?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-here"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "CANDIDATE"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CANDIDATE"
    },
    "token": "jwt-token"
  }
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Interview Endpoints

#### POST /api/interviews
Create a new interview (Candidates and Admins only).

#### GET /api/interviews
Get interviews (filtered by user role).

#### GET /api/interviews/:id
Get specific interview details.

#### PUT /api/interviews/:id
Update interview (Interviewers and Admins only).

#### DELETE /api/interviews/:id
Cancel interview (Interviewers and Admins only).

### Slot Endpoints

#### POST /api/slots
Create a new time slot (Interviewers and Admins only).

#### GET /api/slots
Get available slots.

#### PUT /api/slots/:id
Update slot availability.

#### DELETE /api/slots/:id
Delete slot (if no interview is scheduled).

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── authController.ts
│   │   ├── interviewController.ts
│   │   └── slotController.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/               # API routes
│   │   ├── auth.ts
│   │   ├── interviews.ts
│   │   └── slots.ts
│   ├── utils/                # Utility functions
│   │   ├── logger.ts
│   │   └── emailService.ts
│   └── server.ts             # Main server file
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Joi validation for all inputs
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Error Handling**: Prevents information leakage

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": [...]
  }
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Testing

```bash
npm test
```

## Deployment

1. Set `NODE_ENV=production` in environment
2. Configure production database
3. Set secure JWT secrets
4. Configure email service
5. Run `npm run build` and `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
