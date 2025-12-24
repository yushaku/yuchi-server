/**
 * Base HTTP Exception class (NestJS style)
 */
export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly error?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Exception
 */
export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request', error?: string) {
    super(400, message, error);
  }
}

/**
 * 401 Unauthorized Exception
 */
export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized', error?: string) {
    super(401, message, error);
  }
}

/**
 * 403 Forbidden Exception
 */
export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden', error?: string) {
    super(403, message, error);
  }
}

/**
 * 404 Not Found Exception
 */
export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found', error?: string) {
    super(404, message, error);
  }
}

/**
 * 409 Conflict Exception
 */
export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict', error?: string) {
    super(409, message, error);
  }
}

/**
 * 422 Unprocessable Entity Exception
 */
export class UnprocessableEntityException extends HttpException {
  constructor(message: string = 'Unprocessable Entity', error?: string) {
    super(422, message, error);
  }
}

/**
 * 500 Internal Server Error Exception
 */
export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error', error?: string) {
    super(500, message, error);
  }
}
