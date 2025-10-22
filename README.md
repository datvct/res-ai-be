# Redis AI Backend

NestJS Backend API with Swagger documentation.

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Swagger documentation is available at: `http://localhost:9999/api`

## 📦 API Response Format

All API responses follow a standardized format:

```json
{
  "data": {},           // Response data
  "message": "Success", // Status message
  "statusCode": 200,    // HTTP status code
  "timestamp": "..."    // Response timestamp
}
```

See [RESPONSE_FORMAT.md](./RESPONSE_FORMAT.md) for detailed documentation.

## User Model

Users have the following fields:
- **username** - Unique username for login
- **password** - Hashed password (min 6 characters)
- **fullName** - User's full name
- **phone** - Phone number (optional)
- **roles** - User role: `admin` or `user` (default: user)

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

