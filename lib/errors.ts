export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      body: { error: error.message },
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: { error: error.message },
    }
  }

  return {
    status: 500,
    body: { error: "Internal server error" },
  }
}
