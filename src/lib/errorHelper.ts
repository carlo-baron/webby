import type { ErrorFields } from "#root/types/errorTypes.js";

export class HttpError extends Error {
  status: number;
  fields?: ErrorFields;
  cause?: string;

  constructor(
    status: number,
    message: string,
    fields: ErrorFields,
    cause?: string 
  ) {
    super(message);

    this.status = status;
    this.fields = fields ?? {};
    this.cause = cause ?? "";

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

interface ErrorOptions {
  fields?: ErrorFields;
  cause?: string;
}

function createError(
  status: number,
  defaultMessage: string,
  message?: string,
  options?: ErrorOptions
) {
  return new HttpError(
    status,
    message || defaultMessage,
    options?.fields ?? {},
    options?.cause
  );
}

export function badInput(message?: string, options?: ErrorOptions) {
  return createError(400, "Bad request.", message, options);
}

export function unauthorized(message?: string, options?: ErrorOptions) {
  return createError(401, "Unauthorized request.", message, options);
}

export function forbidden(message?: string, options?: ErrorOptions) {
  return createError(403, "Access denied", message, options);
}

export function notFound(message?: string, options?: ErrorOptions) {
  return createError(404, "Record not found.", message, options);
}

export function conflict(message?: string, options?: ErrorOptions) {
  return createError(409, "Record already exists.", message, options);
}

export function tooMany(message?: string, options?: ErrorOptions) {
  return createError(429, "Too many requests, try again later.", message, options);
}

export function serverError(message?: string, options?: ErrorOptions){
	return createError(500, "Internal server error", message, options)
}
