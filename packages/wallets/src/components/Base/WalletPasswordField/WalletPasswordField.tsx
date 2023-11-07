import React, { FC } from 'react';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import PasswordShow from '../../../public/images/ic-password-show.svg';
import PasswordHide from '../../../public/images/ic-password-hide.svg';
import './WalletPasswordField.scss';
import { IconButton } from '../IconButton';

type WalletPasswordFieldProps = WalletTextFieldProps;

const WalletPasswordField: FC<WalletPasswordFieldProps> = () => {
    const [viewPassword, setViewPassword] = useState(false);
    const toggleView = () => setViewPassword(!viewPassword);

    const strengthColors = {
        0: 'wallets-password__meter--initial',
        1: 'wallets-password__meter--weak',
        2: 'wallets-password__meter--moderate',
        3: 'wallets-password__meter--strong',
        4: 'wallets-password__meter--complete',
    };

    return (
        <div className='wallets-password'>
            <WalletTextField
                renderRightIcon={() => (
                    <IconButton
                        color='transparent'
                        icon={viewPassword ? <PasswordShow /> : <PasswordHide />}
                        isRound
                        onClick={toggleView}
                        size='sm'
                    />
                )}
                type={viewPassword ? 'text' : 'password'}
            />
            <div className='wallets-password__meter'>
                <div className={strengthColors[0]} />
            </div>
        </div>
    );
};

export default WalletPasswordField;
