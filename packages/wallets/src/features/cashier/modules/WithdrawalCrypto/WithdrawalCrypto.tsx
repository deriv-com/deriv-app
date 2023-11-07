import React from 'react';
import { InlineMessage, WalletText } from '../../../../components';
import './WithdrawalCrypto.scss';
import { useActiveWalletAccount } from '@deriv/api';
import { WithdrawalCryptoForm } from './components';
import { Formik } from 'formik';

const WithdrawalCrypto = () => {
    return (
        <div className='wallets-withdrawal-crypto'>
            <WalletText weight='bold'>Withdraw Bitcoin (BTC) to your wallet</WalletText>
            <div className='wallets-withdrawal-crypto-disclaimer'>
                <InlineMessage>
                    <ul className='wallets-withdrawal-crypto-disclaimer__items'>
                        <li>
                            Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If
                            you do, the initial coin offering (ICO) tokens will not be credited into your account.
                        </li>
                        <li>
                            Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to
                            the high volatility of cryptocurrency.
                        </li>
                    </ul>
                </InlineMessage>
            </div>

            <WithdrawalCryptoForm />
        </div>
    );
};

export default WithdrawalCrypto;
