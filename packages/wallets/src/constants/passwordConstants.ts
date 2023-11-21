export const passwordRegex = {
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSymbol: /\W/,
    hasUpperCase: /[A-Z]/,
    isLengthValid: /^.{8,25}$/,
    isPasswordValid: /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}$/,
};

export const passwordValues = {
    longPassword: 12,
    maxLength: 25,
    minLength: 8,
};

export const passwordErrorMessage = {
    invalidLength: 'You should enter 8-25 characters.',
    missingCharacter: 'Password should have lower and uppercase English letters with numbers.',
};
