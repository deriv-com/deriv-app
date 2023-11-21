import { useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';
import { passwordErrorMessage, passwordRegex } from '../constants/passwordConstants';
import { calculateScore, isPasswordValid, Score } from '../utils/passwordUtils';

const usePasswordValidation = (password: string) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [score, setScore] = useState(0);

    const passwordScore = calculateScore(password);
    useEffect(() => {
        const { feedback } = zxcvbn(password);

        if (!passwordRegex.isLengthValid.test(password)) {
            setErrorMessage(passwordErrorMessage.invalidLength);
        } else if (!isPasswordValid(password)) {
            setErrorMessage(passwordErrorMessage.missingCharacter);
        } else {
            setErrorMessage(feedback.warning);
        }

        setScore(passwordScore as Score);
    }, [password, passwordScore]);

    return { errorMessage, score };
};

export default usePasswordValidation;
