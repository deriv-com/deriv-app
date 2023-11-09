import React from 'react';
import { InlineMessage, WalletText } from '../../../../components';
import './WithdrawalCrypto.scss';
import { useActiveWalletAccount } from '@deriv/api';
import { WithdrawalCryptoForm, WithdrawalDisclaimer } from './components';
import { Formik } from 'formik';

const WithdrawalCrypto = () => {
    return (
        <div className='wallets-withdrawal-crypto'>
            <WalletText weight='bold'>Withdraw Bitcoin (BTC) to your wallet</WalletText>
            <WithdrawalDisclaimer />
            <WithdrawalCryptoForm />
        </div>
    );
};

export default WithdrawalCrypto;
