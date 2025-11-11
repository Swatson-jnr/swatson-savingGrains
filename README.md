# Saving Grains Dashboard and API

deployed to https://saving-grains-dashboard-and-api-v2-1j8l08qzs-seyoforis-projects.vercel.app

This is a [Next.js](https://nextjs.org) project that provides both a dashboard interface and API endpoints for the Saving Grains application.

## Features

- 🔐 **Authentication System**: Two-factor authentication with OTP via SMS
- 👥 **User Management**: Create and manage user accounts
- 💰 **Wallet Requests**: Handle wallet funding requests with multiple payment methods
- 📱 **SMS Integration**: OTP delivery via SMS
- 🔒 **JWT Security**: Secure API endpoints with JWT tokens

## API Documentation

Comprehensive API documentation is available in the `docs/` directory:

- **[API Documentation](docs/api-documentation.md)** - Complete endpoint documentation
- **[OpenAPI Specification](docs/openapi.yaml)** - Machine-readable API spec
- **[API Testing](docs/api-tests.http)** - HTTP file for testing endpoints
- **[Documentation Guide](docs/README.md)** - How to use the documentation

### Quick API Overview

| Endpoint               | Method | Description            | Auth Required |
| ---------------------- | ------ | ---------------------- | ------------- |
| `/api/auth/login`      | POST   | User login with OTP    | No            |
| `/api/auth/verify-otp` | POST   | Verify OTP and get JWT | No            |
| `/api/users`           | GET    | Get all users          | Yes           |
| `/api/users`           | POST   | Create new user        | No            |
| `/api/wallet-request`  | POST   | Create wallet request  | Yes           |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- SMS service credentials (for OTP)

### Environment Variables

Copy the example environment file and configure your values:

```bash
# Copy the example file
cp .env.example .env.local

# Edit the file with your actual values
nano .env.local
```

Required environment variables (see `.env.example` for details):

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret  
JWT_SECRET=your_jwt_secret_key

# SMS Service (Arkesel)
ARKESEL_BASE_URL=https://sms.arkesel.com/api/v2
ARKESEL_SENDER_ID=your_sender_id
ARKESEL_API_KEY=your_arkesel_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Models

The application uses MongoDB with Mongoose ODM and includes:

- **User Model**: User accounts with authentication
- **Wallet Request Model**: Wallet funding requests with various payment methods

## Development

You can start editing the pages by modifying files in the `app/` directory. The application auto-updates as you edit files.

### Project Structure

```
├── app/
│   ├── api/          # API routes
│   │   ├── auth/     # Authentication endpoints
│   │   ├── users/    # User management
│   │   └── wallet-request/ # Wallet requests
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── models/       # Database models
│   ├── middleware/   # Auth middleware
│   ├── utils/        # Utility functions
│   ├── auth.ts
│   └── db.ts
├── docs/             # API documentation
└── public/
```

### Testing the API

Use the provided HTTP file for testing:

1. Install the REST Client extension in VS Code
2. Open `docs/api-tests.http`
3. Update the variables with your actual values
4. Click "Send Request" above each endpoint

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Mongoose Documentation](https://mongoosejs.com/docs/) - MongoDB object modeling for Node.js
- [JWT.io](https://jwt.io/) - Learn about JSON Web Tokens

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

