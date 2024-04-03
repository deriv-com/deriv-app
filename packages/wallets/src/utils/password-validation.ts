import * as Yup from 'yup';
import { passwordErrorMessage, passwordRegex, passwordValues } from '../constants/password';

export type Score = 0 | 1 | 2 | 3 | 4;
export type passwordKeys =
    | 'common'
    | 'commonNames'
    | 'dates'
    | 'extendedRepeat'
    | 'keyPattern'
    | 'namesByThemselves'
    | 'pwned'
    | 'recentYears'
    | 'sequences'
    | 'similarToCommon'
    | 'simpleRepeat'
    | 'straightRow'
    | 'topHundred'
    | 'topTen'
    | 'userInputs'
    | 'wordByItself';

// Calculate Scores based on password strength
export const validPassword = (value: string) => {
    return passwordRegex.isPasswordValid.test(value);
};

export const validPasswordMT5 = (value: string) => {
    return passwordRegex.isMT5PasswordValid.test(value);
};

export const isPasswordValid = (password: string) => {
    return passwordRegex.isPasswordValid.test(password) && passwordRegex.isLengthValid.test(password);
};

export const isPasswordModerate = (password: string) => {
    const hasMoreThanOneSymbol = (password.match(/\W/g) ?? []).length > 1;
    return (
        isPasswordValid(password) &&
        hasMoreThanOneSymbol &&
        password.length >= passwordValues.minLength &&
        password.length < passwordValues.longPassword &&
        passwordRegex.isLengthValid
    );
};

export const isPasswordStrong = (password: string) => {
    const hasMoreThanOneSymbol = (password.match(/\W/g) ?? []).length > 1;
    return (
        isPasswordValid(password) &&
        hasMoreThanOneSymbol &&
        password.length >= passwordValues.longPassword &&
        passwordRegex.isLengthValid
    );
};

export const calculateScore = (password: string) => {
    if (password.length === 0) return 0;
    if (!isPasswordValid(password)) return 1;
    if (!isPasswordStrong(password) && isPasswordValid(password) && !isPasswordModerate(password)) return 2;
    if (!isPasswordStrong(password) && isPasswordValid(password) && isPasswordModerate(password)) return 3;
    if (isPasswordStrong(password)) return 4;
};

// Password Schemas
export const mt5Schema = Yup.string()
    .required(passwordErrorMessage.invalidLengthMT5)
    .matches(passwordRegex.isMT5LengthValid, passwordErrorMessage.invalidLengthMT5)
    .matches(passwordRegex.isPasswordValid, passwordErrorMessage.missingCharacter)
    .matches(passwordRegex.isMT5PasswordValid, passwordErrorMessage.missingCharacterMT5);

export const cfdSchema = Yup.string()
    .required(passwordErrorMessage.invalidLength)
    .matches(passwordRegex.isLengthValid, passwordErrorMessage.invalidLength)
    .matches(passwordRegex.isPasswordValid, passwordErrorMessage.missingCharacter);
