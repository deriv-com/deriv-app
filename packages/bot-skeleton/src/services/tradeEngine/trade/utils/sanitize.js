export const isPositiveInteger = num => isPositiveNumber(num) && Number.isInteger(num);

export const isPositiveNumber = num => Number.isFinite(num) && num > 0;
