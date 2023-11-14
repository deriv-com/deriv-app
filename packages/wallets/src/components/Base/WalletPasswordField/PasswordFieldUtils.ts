export const handlePasswordScores = (passwordValue: string) => {
    let score = 0;

    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    const hasDigit = /[0-9]/.test(passwordValue);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue);
    const hasMinLength = passwordValue.length >= 8 && passwordValue.length <= 25;

    if (!hasMinLength) {
        score++;
    }

    if (hasMinLength) {
        score += Number(hasLowerCase) + Number(hasUpperCase) + Number(hasDigit);
    }

    if (hasSpecialChar) {
        score++;
    }

    return Math.min(score, 3);
};
export type Score = 0 | 1 | 2 | 3 | 4;

export const passwordFeedback: Partial<Record<Score, string>> = {
    1: 'You should enter 8 - 25 characters',
    2: 'Password should have lower and uppercase English letters with numbers.',
    3: 'This is a very common password',
};
