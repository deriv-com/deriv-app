import React, { useCallback, useMemo, useState } from 'react';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';
import { passwordErrorMessage, passwordRegex, warningMessages } from '../../../constants/password';
import { calculateScore, isPasswordValid, passwordKeys, Score, validPassword } from '../../../utils/password';
import { WalletPasswordFieldProps } from '../WalletPasswordFieldLazy/WalletPasswordFieldLazy';
import { WalletTextField } from '../WalletTextField';
import PasswordMeter from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

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
        errorMessage = warningMessages[feedback.warning as passwordKeys] ?? '';
    }
    return { errorMessage, score };
};

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    autoComplete,
    label,
    message,
    name = 'walletPasswordField',
    onChange,
    password,
    passwordError,
    shouldDisablePasswordMeter = false,
    showMessage,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    const { errorMessage, score } = useMemo(() => validatePassword(password), [password]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            if (!isTouched) {
                setIsTouched(true);
            }
        },
        [isTouched, onChange]
    );

    const handleBlur = useCallback(() => {
        if (!isTouched) {
            setIsTouched(true);
        }
    }, [isTouched]);

    function getMessage() {
        if (isTouched) {
            if (errorMessage) {
                return errorMessage;
            }
            return message;
        }
    }

    return (
        <div className='wallets-password'>
            <WalletTextField
                autoComplete={autoComplete}
                errorMessage={isTouched && (passwordError ? passwordErrorMessage.PasswordError : errorMessage)}
                isInvalid={(!validPassword(password) && isTouched) || passwordError}
                label={label}
                message={getMessage()}
                messageVariant={errorMessage ? 'warning' : undefined}
                name={name}
                onBlur={handleBlur}
                onChange={handleChange}
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setIsPasswordVisible} viewPassword={isPasswordVisible} />
                )}
                showMessage={showMessage}
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
            />
            {!shouldDisablePasswordMeter && <PasswordMeter score={score as Score} />}
        </div>
    );
};

export default WalletPasswordField;
