import React, { useState } from 'react';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import { passwordChecker, passwordPattern, Score } from './PasswordFieldUtils';
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
    const [viewPassword, setViewPassword] = useState(false);
    const { message, score } = passwordChecker(password);

    return (
        <div className='wallets-password'>
            <WalletTextField
                label={label}
                message={message}
                onChange={onChange}
                pattern={passwordPattern}
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setViewPassword} viewPassword={viewPassword} />
                )}
                showMessage
                type={viewPassword ? 'text' : 'password'}
                value={password}
            />
            {!shouldDisablePasswordMeter && <PasswordMeter score={score as Score} />}
        </div>
    );
};

export default WalletPasswordField;
