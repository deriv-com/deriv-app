import React, { useState } from 'react';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import { handlePasswordScores, passwordFeedback, passwordPattern, Score } from './PasswordFieldUtils';
import PasswordMeter from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

interface WalletPasswordFieldProps extends WalletTextFieldProps {
    password: string;
    shouldDisablePasswordMeter?: boolean;
}

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    password,
    shouldDisablePasswordMeter = false,
    ...rest
}) => {
    const [viewPassword, setViewPassword] = useState(false);
    const passwordScore = password ? handlePasswordScores(password) : 0;

    return (
        <div className='wallets-password'>
            <WalletTextField
                message={passwordFeedback[passwordScore as Score]}
                pattern={passwordPattern}
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setViewPassword} viewPassword={viewPassword} />
                )}
                showMessage
                type={viewPassword ? 'text' : 'password'}
                value={password}
                {...rest}
            />
            {!shouldDisablePasswordMeter && <PasswordMeter score={passwordScore as Score} />}
        </div>
    );
};

export default WalletPasswordField;
