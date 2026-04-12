export type ErrorFields = Record<string, { name: string; message: string }>;

export interface DetailedError extends Error {
  status?: number;
  fields?: ErrorFields;
  cause?: string;
}

