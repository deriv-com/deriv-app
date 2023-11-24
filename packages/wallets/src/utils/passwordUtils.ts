import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';
import { passwordErrorMessage, passwordRegex, passwordValues, warningMessages } from '../constants/passwordConstants';

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

export const validPassword = (value: string) => passwordRegex.isPasswordValid.test(value);

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

export const validatePassword = (password: string) => {
    const score = calculateScore(password);
    let errorMessage = '';

    const options = { dictionary: { ...dictionary } };
    zxcvbnOptions.setOptions(options);

    const { feedback } = zxcvbn(password);
    if (!passwordRegex.isLengthValid.test(password)) {
        errorMessage = passwordErrorMessage.invalidLength;
    } else if (!isPasswordValid(password)) {
        errorMessage = passwordErrorMessage.missingCharacter;
    } else {
        errorMessage = warningMessages[feedback.warning as passwordKeys] || '';
    }
    return { errorMessage, score };
};
