import React, { useMemo, useState } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';
import PasswordHide from '../../../public/images/ic-password-hide.svg';
import PasswordShow from '../../../public/images/ic-password-show.svg';
import { IconButton } from '../IconButton';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import PasswordMeter, { PasswordMeterProps } from './PasswordMeter';
import './WalletPasswordField.scss';

type StrengthMessage = Record<1 | 2 | 3 | 4, string>;

interface WalletPasswordFieldProps extends WalletTextFieldProps, PasswordMeterProps {
    messageObj?: StrengthMessage;
    showPasswordMeter?: boolean;
}

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({ messageObj, showPasswordMeter = true }) => {
    const [password, setPassword] = useState('');
    const [viewPassword, setViewPassword] = useState(false);
    const hasMessage = !!messageObj;

    const passwordStrength = zxcvbn(password).score;
    const progressText = useMemo(() => {
        return messageObj ? messageObj[passwordStrength as keyof StrengthMessage] : '';
    }, [messageObj, passwordStrength]);

    const PasswordViewerIcon = useMemo(
        () => (
            <IconButton
                color='transparent'
                icon={viewPassword ? <PasswordShow /> : <PasswordHide />}
                isRound
                onClick={() => setViewPassword(prevViewPassword => !prevViewPassword)}
                size='sm'
            />
        ),
        [viewPassword]
    );

    return (
        <div className='wallets-password'>
            <WalletTextField
                helperMessage={progressText}
                onChange={e => setPassword(e.target.value)}
                renderRightIcon={() => PasswordViewerIcon}
                showMessage={hasMessage}
                type={viewPassword ? 'text' : 'password'}
            />
            {showPasswordMeter && <PasswordMeter strength={passwordStrength} />}
        </div>
    );
};

export default WalletPasswordField;
