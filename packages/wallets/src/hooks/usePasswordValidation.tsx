import { useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';

const usePasswordValidation = (password: string) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [score, setScore] = useState(0);

    const isValidPassword = (password: string) => /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}$/.test(password);

    useEffect(() => {
        const { feedback } = zxcvbn(password);

        if (!/^.{8,25}$/.test(password)) {
            setErrorMessage('You should enter 8-25 characters.');
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
            setErrorMessage('Password should have lower and uppercase English letters with numbers.');
        } else {
            setErrorMessage(feedback.warning);
        }
    }, [password]);

    useEffect(() => {
        const hasNumber = /\d/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const isLengthValid = /^.{8,25}$/.test(password);
        const hasSymbol = /\W/.test(password);
        const hasMoreThanOneSymbol = (password.match(/\W/g) || []).length > 1;

        const longPassword = 12;
        const minLength = 8;
        const validPassword =
            hasNumber && hasUpper && hasLower && hasSymbol && isLengthValid && password.length >= minLength;
        const strongPassword =
            validPassword && hasMoreThanOneSymbol && password.length >= longPassword && isLengthValid;

        if (password.length === 0) {
            setScore(0);
        } else if (!validPassword) {
            setScore(1);
        } else if (validPassword && !strongPassword) {
            setScore(2);
        } else if (validPassword && hasMoreThanOneSymbol && password.length < longPassword) {
            setScore(3);
        } else if (strongPassword) {
            setScore(4);
        }
    }, [password]);

    return { errorMessage, isValidPassword, score };
};

export default usePasswordValidation;
