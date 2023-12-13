import React, { useCallback, useState } from 'react';
import { passwordErrorMessage } from '../../../constants/password';
import { Score, validatePassword, validPassword } from '../../../utils/password';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import PasswordMeter from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

interface WalletPasswordFieldProps extends WalletTextFieldProps {
    password: string;
    passwordError?: boolean;
    shouldDisablePasswordMeter?: boolean;
}

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    autoComplete,
    label,
    name = 'walletPasswordField',
    onChange,
    password,
    passwordError,
    shouldDisablePasswordMeter = false,
    showMessage,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    const { errorMessage, score } = validatePassword(password);

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

    return (
        <div className='wallets-password'>
            <WalletTextField
                autoComplete={autoComplete}
                errorMessage={passwordError ? passwordErrorMessage.PasswordError : errorMessage}
                isInvalid={(!validPassword(password) && isTouched) || passwordError}
                label={label}
                message={isTouched ? errorMessage : ''}
                messageVariant='warning'
                name={name}
                onBlur={handleBlur}
                onChange={handleChange}
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setIsPasswordVisible} viewPassword={isPasswordVisible} />
                )}
                showMessage={showMessage}
                type={isPasswordVisible ? 'text' : 'password'}
                value={passwordError ? '' : password}
            />
            {!shouldDisablePasswordMeter && <PasswordMeter score={score as Score} />}
        </div>
    );
};

export default WalletPasswordField;
