export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  fieldErrors?: ValidationError[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: ValidationError[];

  constructor(message: string, status: number, fieldErrors?: ValidationError[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
