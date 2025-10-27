# Production-Ready Authentication System

A complete authentication system built with Node.js, Express, and MongoDB featuring email verification, JWT tokens, and role-based access control.

## Features

✅ User signup with email verification (OTP)  
✅ Secure password hashing with bcrypt  
✅ Access & Refresh token authentication  
✅ Role-based access control (user/admin)  
✅ Email service with Nodemailer  
✅ Input validation  
✅ Error handling middleware  
✅ Rate limiting  
✅ Production-ready code structure

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Email:** Nodemailer
- **Validation:** Custom validators

## Installation

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb://localhost:27017/auth_system

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Admin Creation Key
ADMIN_SECRET_KEY=your_admin_secret_key_change_this

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapp.com

# OTP Configuration
OTP_EXPIRY_MINUTES=10
```

### 3. Gmail Setup (for Email Service)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD`

### 4. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Public Routes

#### 1. Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user"
}

// For admin signup
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "role": "admin",
  "adminKey": "your_admin_secret_key"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Signup successful. Please check your email for OTP verification.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### 2. Verify OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully. You can now login.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

#### 3. Resend OTP

```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 4. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 5. Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Routes

#### 6. Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 7. Logout

```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

#### 8. Admin Only Route (Example)

```http
GET /api/auth/admin-only
Authorization: Bearer <accessToken>
```

## Project Structure

```
auth-system/
├── controllers/
│   └── authController.js       # Business logic
├── middlewares/
│   ├── authMiddleware.js       # JWT verification & authorization
│   └── errorHandler.js         # Centralized error handling
├── models/
│   └── User.js                 # User schema & methods
├── routes/
│   └── authRoutes.js           # API routes
├── services/
│   └── emailService.js         # Email sending logic
├── utils/
│   └── jwtUtils.js             # JWT generation & verification
├── validators/
│   └── authValidator.js        # Input validation
├── .env                        # Environment variables
├── server.js                   # Entry point
└── package.json
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&\*(),.?":{}|<>)

## Security Features

- **Password Hashing:** bcrypt with salt rounds of 12
- **JWT Tokens:** Separate access & refresh tokens
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **Input Validation:** Comprehensive validation for all inputs
- **Email Verification:** Mandatory OTP verification before login
- **No Sensitive Data Exposure:** Passwords, OTPs, and tokens never sent in responses
- **Token Rotation:** New refresh token on each refresh

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Environment Variables Explanation

- `JWT_ACCESS_EXPIRY`: Short-lived token (default: 15m)
- `JWT_REFRESH_EXPIRY`: Long-lived token (default: 7d)
- `OTP_EXPIRY_MINUTES`: OTP validity period (default: 10 minutes)
- `ADMIN_SECRET_KEY`: Required to create admin accounts

## Production Deployment Checklist

- [ ] Change all secret keys in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use proper MongoDB URI (Atlas/production database)
- [ ] Set up proper email service (not Gmail for production)
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure proper rate limiting
- [ ] Set up logging service
- [ ] Enable database backups
- [ ] Set up monitoring and alerts

## Common Issues

### Email Not Sending

- Verify Gmail App Password is correct
- Check 2FA is enabled on Gmail
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly
- For production, use dedicated email service (SendGrid, AWS SES)

### MongoDB Connection Failed

- Ensure MongoDB is running locally or connection string is correct
- Check network connectivity
- Verify MongoDB URI format

### JWT Token Issues

- Ensure secrets are properly set in `.env`
- Tokens expire based on expiry settings
- Use refresh token endpoint to get new access token

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
# backend
