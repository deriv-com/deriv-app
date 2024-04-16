import React, { useCallback, useMemo, useState } from 'react';
import { ValidationError } from 'yup';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';
import { passwordErrorMessage, warningMessages } from '../../../constants/password';
import {
    calculateScore,
    cfdSchema,
    mt5Schema,
    passwordKeys,
    Score,
    validPassword,
    validPasswordMT5,
} from '../../../utils/password-validation';
import { WalletPasswordFieldProps } from '../WalletPasswordFieldLazy/WalletPasswordFieldLazy';
import { WalletTextField } from '../WalletTextField';
import PasswordMeter from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

export const validatePassword = (password: string, mt5Policy: boolean) => {
    const score = calculateScore(password);
    let errorMessage = '';

    const options = { dictionary: { ...dictionary } };
    zxcvbnOptions.setOptions(options);

    const { feedback } = zxcvbn(password);
    try {
        if (mt5Policy) {
            mt5Schema.validateSync(password);
        } else {
            cfdSchema.validateSync(password);
        }
        errorMessage = warningMessages[feedback.warning as passwordKeys] ?? '';
    } catch (err) {
        if (err instanceof ValidationError) {
            errorMessage = err?.message;
        }
    }

    return { errorMessage, score };
};

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    autoComplete,
    label,
    message,
    mt5Policy = false,
    name = 'walletPasswordField',
    onChange,
    password,
    passwordError,
    shouldDisablePasswordMeter = false,
    showMessage,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    const { errorMessage, score } = useMemo(() => validatePassword(password, mt5Policy), [password, mt5Policy]);
    const passwordValidation = mt5Policy ? !validPasswordMT5(password) : !validPassword(password);

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
                isInvalid={(passwordValidation && isTouched) || passwordError}
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
