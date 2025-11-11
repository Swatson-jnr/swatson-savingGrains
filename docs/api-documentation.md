# Saving Grains API Documentation

## Overview

The Saving Grains API provides endpoints for user authentication, user management, and wallet request functionality. All endpoints follow RESTful conventions and return JSON responses.

**Base URL:** `http://localhost:3000/api` (development)

## Authentication

Most endpoints require authentication via JWT token passed in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication

#### POST /api/auth/login

Initiates user login by sending an OTP to the user's phone number.

**Request Body:**

```json
{
  "phone_number": "string",
  "password": "string"
}
```

**Responses:**

- **200 OK**

  ```json
  {
    "message": "OTP sent via SMS",
    "otp": "123456"
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Phone number and password are required"
  }
  ```

- **401 Unauthorized**

  ```json
  {
    "error": "Invalid credentials"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error": "User not found"
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "Internal server error"
  }
  ```

#### POST /api/auth/verify-otp

Verifies the OTP and returns a JWT token for authenticated requests.

**Request Body:**

```json
{
  "phone_number": "string",
  "otp": "string"
}
```

**Responses:**

- **200 OK**

  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Phone number and OTP required"
  }
  ```

  ```json
  {
    "error": "Invalid OTP"
  }
  ```

  ```json
  {
    "error": "OTP expired"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error": "User not found"
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "Server error"
  }
  ```

### Users

#### GET /api/users

Retrieves all users in the system.

**Authentication:** Required

**Responses:**

- **200 OK**

  ```json
  [
    {
      "_id": "string",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "phone_number": "string",
      "roles": ["string"],
      "system": boolean,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "Failed to fetch users"
  }
  ```

#### POST /api/users

Creates a new user account.

**Request Body:**

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone_number": "string",
  "password": "string",
  "roles": ["string"] // optional
}
```

**Responses:**

- **201 Created**

  ```json
  {
    "_id": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone_number": "string",
    "roles": ["string"],
    "system": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Missing required fields"
  }
  ```

- **409 Conflict**

  ```json
  {
    "error": "User already exists"
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "Failed to create user"
  }
  ```

### Wallet Requests

#### POST /api/wallet-request

Creates a new wallet funding request.

**Authentication:** Required

**Request Body:**

```json
{
  "amount": number,
  "payment_method": "Cash Payment" | "Mobile Money" | "Bank Transfer",
  "provider": "string", // optional, required for Mobile Money
  "phone_number": "string", // optional, required for Mobile Money
  "bank_name": "string", // optional, required for Bank Transfer
  "branch_name": "string", // optional, required for Bank Transfer
  "reason": "string"
}
```

**Field Requirements by Payment Method:**

- **Cash Payment:** `amount`, `payment_method`, `reason`
- **Mobile Money:** `amount`, `payment_method`, `provider`, `phone_number`, `reason`
- **Bank Transfer:** `amount`, `payment_method`, `bank_name`, `branch_name`, `reason`

**Responses:**

- **201 Created**

  ```json
  {
    "_id": "string",
    "user": "string",
    "amount": number,
    "payment_method": "string",
    "provider": "string",
    "phone_number": "string",
    "bank_name": "string",
    "branch_name": "string",
    "reason": "string",
    "status": "pending",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Missing required fields"
  }
  ```

- **401 Unauthorized**

  ```json
  {
    "error": "Unauthorized"
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "Failed to create wallet request"
  }
  ```

## Data Models

### User

```typescript
{
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string; // hashed
  roles?: string[];
  system: boolean;
  otp?: string | null;
  otp_expires_at?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Wallet Request

```typescript
{
  _id: string;
  user: string; // User ObjectId
  amount: number;
  payment_method: "Cash Payment" | "Mobile Money" | "Bank Transfer";
  provider?: string;
  phone_number?: string;
  bank_name?: string;
  branch_name?: string;
  reason: string;
  status: "pending" | "approved" | "declined" | "successful";
  reviewed_by?: string; // User ObjectId
  reviewed_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes used:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid credentials, missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production use.

## Security Notes

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire after 7 days
- OTP codes expire after 5 minutes
- Phone numbers and emails must be unique in the system

