export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public details: any;

  constructor(message: string, details?: any) {
    super(message, 422);
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export const handleError = (error: Error) => {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        error: error.message,
        details: (error as ValidationError).details,
      },
    };
  }

  // Default error response
  return {
    status: 500,
    body: {
      error: 'Internal server error',
    },
  };
};
