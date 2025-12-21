# Elysia Server Architecture

This project follows a structured architecture pattern for Elysia applications.

## Project Structure

```
src/
├── app.ts                 # Main application setup and initialization
├── index.ts               # Entry point
├── config/
│   └── env.ts            # Environment configuration
├── middleware/
│   ├── cors.ts           # CORS middleware
│   ├── error-handler.ts  # Global error handling
│   └── logger.ts         # Request logging
├── routes/
│   ├── index.ts          # Route aggregator
│   └── health.ts         # Health check routes
├── controllers/
│   └── example.controller.ts  # Example controller (handles HTTP requests)
├── services/
│   └── example.service.ts     # Example service (business logic)
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/
    └── response.ts       # Response helper utilities
```

## Architecture Pattern

- **Routes**: Define route groups and prefixes
- **Controllers**: Handle HTTP requests/responses, call services
- **Services**: Contain business logic, data processing
- **Middleware**: Cross-cutting concerns (logging, CORS, error handling)
- **Types**: Shared TypeScript types and interfaces
- **Utils**: Reusable utility functions
- **Config**: Application configuration and environment variables

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run development server:

   ```bash
   pnpm dev
   ```

3. Test endpoints:
   - `GET /` - Welcome message
   - `GET /health` - Health check
   - `GET /api/example` - Example GET endpoint
   - `POST /api/example` - Example POST endpoint

## Adding New Features

1. Create a service in `services/` for business logic
2. Create a controller in `controllers/` that uses the service
3. Add routes in `routes/` and register the controller
4. Update types in `types/` if needed
