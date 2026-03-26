export class AppError extends Error {
  code: string;
  details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false as const,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  return {
    success: false as const,
    error: {
      code: "INTERNAL_ERROR",
      message
    }
  };
}
