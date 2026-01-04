# Logging Documentation

## Overview

This project uses **Winston** for application logging and **Morgan** for HTTP request logging, providing production-ready logging with file rotation, multiple log levels, and structured output.

## Log Levels

The application supports the following log levels (in order of severity):

- `error` - Critical errors that require immediate attention
- `warn` - Warning messages for potentially harmful situations
- `info` - General informational messages about application flow
- `debug` - Detailed debugging information (only in development)

## Configuration

### Environment-Based Logging

The log level is automatically adjusted based on the `NODE_ENV` environment variable:

- **Development** (`NODE_ENV=development`): Log level set to `debug`
- **Production** (`NODE_ENV=production`): Log level set to `info`

### Log Files

Logs are written to the following locations:

- `logs/combined.log` - All logs (info, warn, error, debug)
- `logs/error.log` - Error logs only

**Log Rotation:**

- Maximum file size: 5MB
- Maximum files kept: 5 (older logs are automatically deleted)

## Usage

### Importing the Logger

```typescript
import logger from "./utils/logger.js";
```

### Basic Examples

#### Info Messages

```typescript
logger.info("User logged in successfully");
logger.info(`Processing order ${orderId}`);
```

#### Warning Messages

```typescript
logger.warn("Database connection slow");
logger.warn(`Invalid request from IP: ${ip}`);
```

#### Error Messages

```typescript
logger.error("Failed to connect to database", error);
logger.error(`Payment processing failed: ${error.message}`);
```

#### Debug Messages (Development Only)

```typescript
logger.debug("Request payload:", req.body);
logger.debug(`Cache hit for key: ${key}`);
```

### In Route Handlers

```typescript
app.post("/api/users", async (req, res) => {
    try {
        logger.info(`Creating new user: ${req.body.email}`);
        const user = await User.create(req.body);
        logger.info(`User created successfully: ${user.id}`);
        res.status(201).json(user);
    } catch (error) {
        logger.error("Error creating user:", error);
        res.status(500).json({error: "Failed to create user"});
    }
});
```

### In Database Connections

```typescript
try {
    await mongoose.connect(connectionString);
    logger.info("Connected to MongoDB successfully");
} catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
}
```

## HTTP Request Logging

Morgan automatically logs all HTTP requests with the following format:

```
2026-01-04 10:30:45 [INFO]: GET /api/users 200 1234 - 45.23 ms
```

Format includes:

- HTTP method
- URL path
- Status code
- Response size (bytes)
- Response time (ms)

## Console Output

In development, console output is **colorized** for better readability:

- 🔴 **ERROR** - Red
- 🟡 **WARN** - Yellow
- 🟢 **INFO** - Green
- 🔵 **DEBUG** - Blue

## Best Practices

### DO ✅

- Use appropriate log levels for different message types
- Include context in log messages (user IDs, order IDs, etc.)
- Log errors with the error object for stack traces
- Log important business events (user registration, payments, etc.)
- Use structured logging for complex data

### DON'T ❌

- Log sensitive information (passwords, tokens, credit cards)
- Log in tight loops (can cause performance issues)
- Use `console.log()` - always use the logger
- Log excessive debug information in production

## Examples by Scenario

### Authentication

```typescript
logger.info(`User login attempt: ${email}`);
logger.info(`User ${userId} logged in successfully`);
logger.warn(`Failed login attempt for: ${email}`);
logger.error(`Authentication error: ${error.message}`);
```

### Database Operations

```typescript
logger.debug(`Querying database: ${query}`);
logger.info(`Retrieved ${results.length} records`);
logger.warn(`Slow query detected: ${duration}ms`);
logger.error(`Database query failed: ${error.message}`);
```

### API Requests

```typescript
logger.info(`External API call to: ${apiUrl}`);
logger.warn(`API rate limit approaching: ${remaining} requests left`);
logger.error(`External API failed: ${error.message}`);
```

### Background Jobs

```typescript
logger.info(`Starting job: ${jobName}`);
logger.info(`Job completed successfully in ${duration}ms`);
logger.error(`Job failed: ${jobName}`, error);
```

## Monitoring Logs

### View Real-time Logs

```bash
# Watch combined logs
tail -f logs/combined.log

# Watch error logs only
tail -f logs/error.log
```

### Search Logs

```bash
# Find all errors
grep "ERROR" logs/combined.log

# Find specific user activity
grep "userId:12345" logs/combined.log
```

## Production Considerations

1. **Log Aggregation**: Consider using services like CloudWatch, Datadog, or ELK Stack
2. **Disk Space**: Monitor log directory size to prevent disk full issues
3. **Sensitive Data**: Never log passwords, tokens, or PII
4. **Performance**: Excessive logging can impact application performance
5. **Retention**: Implement log retention policies based on compliance requirements

## Troubleshooting

### Logs not being created

- Check write permissions for the `logs/` directory
- Ensure the logger is imported before use
- Verify `NODE_ENV` is set correctly

### Console logs not appearing

- Check if the application is running in production mode
- Verify logger configuration in `src/utils/logger.ts`

### Log files too large

- Reduce log rotation size in logger configuration
- Decrease the number of files kept
- Implement external log aggregation
