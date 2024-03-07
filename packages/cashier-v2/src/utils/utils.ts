import type { TErrorTypes } from '../types';

export const isServerError = (error: unknown): error is TErrorTypes.TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;
