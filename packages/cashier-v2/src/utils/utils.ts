import type { TErrorTypes } from '../types';

export const isServerError = (error: unknown): error is TErrorTypes.TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

export const capitalizeFirstLetter = (targetString: string) =>
    targetString && targetString[0].toUpperCase() + targetString.slice(1);
