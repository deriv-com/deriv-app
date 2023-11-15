import React from 'react';
import { ModalStepWrapper, WalletButton, WalletText } from '../../../../components/Base';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import './ChangePassword.scss';

const ChangePassword = () => {
    return (
        <ModalStepWrapper closeOnEscape title='Manage Deriv MT5 password'>
            <div className='wallets-change-password__modal-wrapper'>
                <div className='wallets-change-password__container'>
                    <div className='wallets-change-password__tab'>
                        <button className='wallets-change-password__tab--btn-active'>
                            <WalletText weight='bold'>Deriv MT5 password</WalletText>
                        </button>
                        <button className='wallets-change-password__tab--btn'>
                            <WalletText weight='bold'>Investor password</WalletText>
                        </button>
                    </div>
                    <div className='wallets-change-password__content'>
                        <div className='change-password__content--icon'>
                            <MT5PasswordIcon />
                        </div>
                        <div className='wallets-change-password__content--text'>
                            <WalletText align='center' weight='bold'>
                                Deriv MT5 password
                            </WalletText>
                            <WalletText align='center' size='sm'>
                                Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile
                                apps.
                            </WalletText>
                        </div>
                        <div className='wallets-change-password__content--btn'>
                            <WalletButton size='lg' text='Change password' />
                        </div>
                    </div>
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default ChangePassword;
