export const decimalValidator = v => /^(\d+\.)?\d+$/.test(v);

export const lengthValidator = v => v.length >= 1 && v.length <= 300;

export const textValidator = v => /^[\p{L}\p{Nd}\s'.,:;()@#+/-]*$/u.test(v);
