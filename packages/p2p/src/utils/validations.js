export const decimalValidator = v => /^(\d+\.)?\d+$/.test(v);

export const lengthValidator = v => v.length >= 1 && v.length <= 300;

export const textValidator = v => /^[\p{L}\p{Nd}\s'.,:;()@#+/-]*$/u.test(v);

// Validates if the given value falls within the set range and returns a boolean
export const rangeValidator = (input, limit) => input >= limit * -1 && input <= limit;

// validates floating-point integers in input box that do not contain scientific notation (e, E, -, +) such as 12.2e+2 or 12.2e-2 and no negative numbers
export const floatingPointValidator = v =>
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.'].includes(v) || /^[0-9]*[.]?[0-9]+$(?:[eE\-+]*$)/.test(v);
