import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      body: { error: error.message },
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: { error: error.message },
    };
  }

  return {
    status: 500,
    body: { error: "Internal server error" },
  };
};

export const handleZodErrors = (error: ZodError, message: string) => {
  // ZodError has a built-in .errors array
  const validationErrors = error.errors.map((err) => ({
    field: err.path.join("."), // e.g. "password"
    message: err.message,
  }));

  return NextResponse.json(
    {
      message,
      errors: validationErrors,
    },
    { status: 400 }
  );
};
