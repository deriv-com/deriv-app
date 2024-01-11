import { passwordRegex } from '../constants/password';

export const validPassword = (value: string) => passwordRegex.isPasswordValid.test(value);
