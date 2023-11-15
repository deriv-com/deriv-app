import React from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';

const MT5Password = () => {
    return (
        <>
            <div className='change-password__content--icon'>
                <MT5PasswordIcon />
            </div>
            <div className='wallets-change-password__content--text'>
                <WalletText align='center' weight='bold'>
                    Deriv MT5 password
                </WalletText>
                <WalletText align='center' size='sm'>
                    Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.
                </WalletText>
            </div>
            <div className='wallets-change-password__content--btn'>
                <WalletButton size='lg' text='Change password' />
            </div>
        </>
    );
};

export default MT5Password;
