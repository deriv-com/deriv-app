import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';
import { Platforms } from '../../../../../shared/src/utils/constants';
import { passwordErrorMessage, passwordRegex, warningMessages } from '../../../constants/password';
import { TPlatforms } from '../../../types';
import { calculateScore, passwordKeys, Score, validPassword } from '../../../utils/password-validation';
import { WalletPasswordFieldProps } from '../WalletPasswordFieldLazy/WalletPasswordFieldLazy';
import { WalletTextField } from '../WalletTextField';
import PasswordMeter from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

export const validatePassword = (password: string, platform: TPlatforms.All) => {
    const score = calculateScore(password);
    let errorMessage = '';

    const options = { dictionary: { ...dictionary } };
    zxcvbnOptions.setOptions(options);

    const { feedback } = zxcvbn(password);
    try {
        if (platform === Platforms.MT5) {
            Yup.string()
                .matches(passwordRegex.isMT5LengthValid, passwordErrorMessage.invalidLengthMT5)
                .validateSync(password);
            Yup.string()
                .matches(passwordRegex.isMT5PasswordValid, passwordErrorMessage.missingCharacterMT5)
                .validateSync(password);
        } else {
            Yup.string()
                .matches(passwordRegex.isLengthValid, passwordErrorMessage.invalidLength)
                .validateSync(password);
            Yup.string()
                .matches(passwordRegex.isPasswordValid, passwordErrorMessage.missingCharacter)
                .validateSync(password);
        }
        errorMessage = warningMessages[feedback.warning as passwordKeys] ?? '';
    } catch (err) {
        if (err instanceof Yup.ValidationError) {
            errorMessage = err?.message;
        }
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
    platform,
    shouldDisablePasswordMeter = false,
    showMessage,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    const { errorMessage, score } = useMemo(() => validatePassword(password, platform), [password, platform]);

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
                isInvalid={(!validPassword(password, platform) && isTouched) || passwordError}
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
