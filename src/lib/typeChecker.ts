import type { DetailedError } from "#root/types/errorTypes.js";

export function ThrowBadInput(message: string, options = {}) {
    const err = new Error(message, options) as DetailedError;
    err.status = 400;
    throw err;
}
