# API Documentation

This directory contains comprehensive documentation for the Saving Grains API endpoints.

## Files

- `api-documentation.md` - Human-readable API documentation in Markdown format
- `openapi.yaml` - OpenAPI 3.1.0 specification file for the API

## Viewing the Documentation

### 1. Markdown Documentation

The `api-documentation.md` file provides a complete overview of all API endpoints with:

- Request/response examples
- Authentication requirements
- Error handling
- Data models
- Security notes

### 2. Interactive OpenAPI Documentation

You can view the OpenAPI specification in various ways:

#### Option A: Swagger UI (Recommended)

1. Install the Swagger UI extension in VS Code:
   - Extension ID: `Arjun.swagger-viewer`
2. Open the `openapi.yaml` file
3. Right-click and select "Preview Swagger"

#### Option B: Online Swagger Editor

1. Go to [editor.swagger.io](https://editor.swagger.io/)
2. Copy the content of `openapi.yaml` and paste it in the editor
3. View the interactive documentation on the right panel

#### Option C: Local Swagger UI Setup

```bash
# Install swagger-ui-dist globally
npm install -g swagger-ui-dist

# Serve the OpenAPI spec
swagger-ui-serve docs/openapi.yaml
```

## API Overview

The Saving Grains API consists of three main endpoint groups:

### 🔐 Authentication (`/api/auth`)

- `POST /api/auth/login` - Authenticate user and send OTP
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token

### 👥 Users (`/api/users`)

- `GET /api/users` - Get all users (requires authentication)
- `POST /api/users` - Create new user

### 💰 Wallet Requests (`/api/wallet-request`)

- `POST /api/wallet-request` - Create wallet funding request (requires authentication)

## Authentication Flow

1. **Login**: Send `phone_number` and `password` to `/api/auth/login`
2. **OTP Verification**: Send the received OTP with `phone_number` to `/api/auth/verify-otp`
3. **Authenticated Requests**: Include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Example Usage

### 1. User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+233123456789",
    "password": "your_password"
  }'
```

### 2. Verify OTP

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+233123456789",
    "otp": "123456"
  }'
```

### 3. Create Wallet Request

```bash
curl -X POST http://localhost:3000/api/wallet-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "amount": 100.00,
    "payment_method": "Mobile Money",
    "provider": "MTN",
    "phone_number": "+233123456789",
    "reason": "Monthly savings deposit"
  }'
```

## Development Notes

### Adding New Endpoints

When adding new API endpoints:

1. **Add JSDoc comments** to the route handler following the existing pattern
2. **Update the OpenAPI spec** (`openapi.yaml`) with the new endpoint
3. **Update the Markdown documentation** (`api-documentation.md`)
4. **Add request/response examples** for better understanding

### Documentation Standards

- Use clear, descriptive endpoint summaries
- Include all possible response codes with examples
- Document required vs optional fields
- Provide realistic example values
- Include authentication requirements
- Document field validation rules

### Testing the API

You can test the API endpoints using:

- **Postman**: Import the OpenAPI spec to generate a Postman collection
- **Insomnia**: Import the OpenAPI spec for API testing
- **curl**: Use the provided curl examples
- **VS Code REST Client**: Create `.http` files with requests

## Security Considerations

- JWT tokens expire after 7 days
- OTP codes expire after 5 minutes
- Passwords are hashed using bcrypt with 12 salt rounds
- Phone numbers and emails must be unique
- Rate limiting should be implemented for production use

## Contributing

When contributing to the API:

1. Update documentation alongside code changes
2. Follow the existing documentation patterns
3. Test all documented examples
4. Ensure OpenAPI spec validates correctly
5. Update version numbers appropriately
