export const decimalValidator = v => /^(\d+\.)?\d+$/.test(v);

export const lengthValidator = v => v.length >= 1 && v.length <= 300;

export const textValidator = v => /^[\p{L}\p{Nd}\s'.,:;()@#+/-]*$/u.test(v);

export const rangeValidator = (user_input, offset_limit) =>
    Math.abs(offset_limit) * -1 <= parseFloat(user_input) && Math.abs(offset_limit) >= parseFloat(user_input);
