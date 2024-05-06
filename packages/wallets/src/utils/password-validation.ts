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
// CFD Password Validation
export const validPassword = (value: string) => {
    return passwordRegex.isPasswordValid.test(value);
};

const isPasswordValid = (password: string) => {
    return passwordRegex.isPasswordValid.test(password) && passwordRegex.isLengthValid.test(password);
};

const isPasswordModerate = (password: string) => {
    const hasMoreThanOneSymbol = (password.match(/\W/g) ?? []).length > 1;
    return (
        isPasswordValid(password) &&
        hasMoreThanOneSymbol &&
        password.length >= passwordValues.minLength &&
        password.length < passwordValues.longPassword &&
        passwordRegex.isLengthValid
    );
};

const isPasswordStrong = (password: string) => {
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

// MT5 Password Validation
export const validPasswordMT5 = (value: string) => {
    return passwordRegex.isMT5PasswordValid.test(value);
};

const isPasswordValidMT5 = (password: string) => {
    return passwordRegex.isMT5PasswordValid.test(password) && passwordRegex.isMT5LengthValid.test(password);
};

const isPasswordModerateMT5 = (password: string) => {
    const hasMoreThanOneSymbol = (password.match(/\W/g) ?? []).length > 1;
    return (
        isPasswordValidMT5(password) &&
        hasMoreThanOneSymbol &&
        password.length >= passwordValues.minLength &&
        password.length < passwordValues.maxLengthMT5 &&
        passwordRegex.isMT5LengthValid
    );
};

const isPasswordStrongMT5 = (password: string) => {
    const hasMoreThanOneSymbol = (password.match(/\W/g) ?? []).length > 1;
    return (
        isPasswordValidMT5(password) &&
        hasMoreThanOneSymbol &&
        password.length >= passwordValues.maxLengthMT5 &&
        passwordRegex.isMT5LengthValid
    );
};

export const calculateScoreMT5 = (password: string) => {
    if (password.length === 0) return 0;
    if (!isPasswordValidMT5(password)) return 1;
    if (!isPasswordStrongMT5(password) && isPasswordValidMT5(password) && !isPasswordModerateMT5(password)) return 2;
    if (!isPasswordStrongMT5(password) && isPasswordValidMT5(password) && isPasswordModerateMT5(password)) return 3;
    if (isPasswordStrongMT5(password)) return 4;
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
