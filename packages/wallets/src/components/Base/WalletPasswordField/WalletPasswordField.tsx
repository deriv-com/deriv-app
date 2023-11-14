import React, { useState } from 'react';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import { handlePasswordScores, passwordFeedback, Score } from './PasswordFieldUtils';
import PasswordMeter, { PasswordMeterProps } from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

interface WalletPasswordFieldProps extends WalletTextFieldProps, PasswordMeterProps {
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
                helperMessage={passwordFeedback[passwordScore as Score]}
                pattern='^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}'
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setViewPassword} viewPassword={viewPassword} />
                )}
                showMessage
                type={viewPassword ? 'text' : 'password'}
                value={password}
                {...rest}
            />
            {!shouldDisablePasswordMeter && <PasswordMeter score={passwordScore} />}
        </div>
    );
};

export default WalletPasswordField;
