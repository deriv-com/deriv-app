export type Score = 0 | 1 | 2 | 3 | 4;

export const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[!-~]{8,25}$';

export const passwordChecker = (password: string) => {
    const regexList = [
        {
            passwordFeedback: 'You should enter 8 - 25 characters.',
            pattern: /^.{8,25}$/,
            strength: 1,
        },
        {
            passwordFeedback: 'Password should have lower and uppercase English letters with numbers.',
            pattern: /[A-Za-z0-9]/,
            strength: 1,
        },
        {
            passwordFeedback: 'This is a very common password',
            pattern: /(?=.*abcd)(?=.*1234)/,
            strength: 0,
        },
        {
            passwordFeedback: '',
            pattern: /[^A-Za-z0-9]/,
            strength: 1,
        },
    ];

    let strengthValue = 0;
    let message = '';

    if (!password) return { message: '', score: 0 };

    regexList.forEach(({ passwordFeedback: feedback, pattern, strength }) => {
        if (pattern.test(password)) {
            strengthValue += strength;
        } else if (!message && feedback) {
            message = feedback;
        } else if (!message && !feedback) {
            message = '';
        }
    });

    return { message, score: Math.min(strengthValue, 3) };
};
