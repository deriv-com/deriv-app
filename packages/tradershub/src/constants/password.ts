export const passwordRegex = {
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSymbol: /\W/,
    hasUpperCase: /[A-Z]/,
    isLengthValid: /^.{8,25}$/,
    isPasswordValid: /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}$/,
};

export const passwordRegexDescription = [
    '8 to 16 characters',
    'A special character such as ( _ @ ? ! / # )',
    'An uppercase letter',
    'A lowercase letter',
    'A number',
];
