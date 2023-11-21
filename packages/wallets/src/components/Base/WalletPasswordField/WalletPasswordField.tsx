import React, { useCallback, useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import PasswordMeter from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

interface WalletPasswordFieldProps extends WalletTextFieldProps {
    password: string;
    shouldDisablePasswordMeter?: boolean;
}

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    label,
    onChange,
    password,
    shouldDisablePasswordMeter = false,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [score, setScore] = useState(0);

    const validPassword = (value: string) => /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}$/.test(value);

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

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
        },
        [onChange]
    );

    return (
        <div className='wallets-password'>
            <WalletTextField
                errorMessage={errorMessage}
                isInvalid={!validPassword(password)}
                label={label}
                message={errorMessage}
                messageVariant='warning'
                onChange={handleChange}
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setIsPasswordVisible} viewPassword={isPasswordVisible} />
                )}
                showMessage
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
            />
            {!shouldDisablePasswordMeter && <PasswordMeter score={score} />}
        </div>
    );
};

export default WalletPasswordField;
