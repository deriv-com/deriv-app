import React, { useCallback, useState } from 'react';
import usePasswordValidation from '../../../hooks/usePasswordValidation';
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

    const { errorMessage, isValidPassword, score } = usePasswordValidation(password);

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
                isInvalid={!isValidPassword}
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
