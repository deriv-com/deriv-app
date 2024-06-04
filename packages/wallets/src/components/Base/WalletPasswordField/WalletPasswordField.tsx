import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidationError } from 'yup';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';
import { passwordErrorMessage, warningMessages } from '../../../constants/password';
import {
    calculateScoreCFD,
    calculateScoreMT5,
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
    const score = mt5Policy ? calculateScoreMT5(password) : calculateScoreCFD(password);
    let validationErrorMessage = '';

    const options = { dictionary: { ...dictionary } };
    zxcvbnOptions.setOptions(options);

    const { feedback } = zxcvbn(password);
    try {
        if (mt5Policy) {
            mt5Schema.validateSync(password);
        } else {
            cfdSchema.validateSync(password);
        }
        validationErrorMessage = warningMessages[feedback.warning as passwordKeys] ?? '';
    } catch (err) {
        if (err instanceof ValidationError) {
            validationErrorMessage = err?.message;
        }
    }

    return { score, validationErrorMessage };
};

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    autoComplete,
    label,
    mt5Policy = false,
    name = 'walletPasswordField',
    onChange,
    password,
    passwordError,
    serverErrorMessage,
    shouldDisablePasswordMeter = false,
    showMessage,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { score, validationErrorMessage } = useMemo(
        () => validatePassword(password, mt5Policy),
        [password, mt5Policy]
    );
    const passwordValidation = mt5Policy ? !validPasswordMT5(password) : !validPassword(password);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            if (!isTouched) {
                setIsTouched(true);
            }
            setShowErrorMessage(false);
        },
        [isTouched, onChange]
    );

    const handleBlur = useCallback(() => {
        if (!isTouched) {
            setIsTouched(true);
        }
    }, [isTouched]);

    useEffect(() => {
        setShowErrorMessage(!!passwordError);
        setErrorMessage(passwordError ? passwordErrorMessage.PasswordError : validationErrorMessage);
    }, [passwordError, validationErrorMessage]);

    return (
        <div className='wallets-password'>
            <WalletTextField
                autoComplete={autoComplete}
                errorMessage={isTouched && (serverErrorMessage || errorMessage)}
                isInvalid={(passwordValidation && isTouched) || showErrorMessage || !!passwordError}
                label={label}
                messageVariant={validationErrorMessage ? 'warning' : undefined}
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
