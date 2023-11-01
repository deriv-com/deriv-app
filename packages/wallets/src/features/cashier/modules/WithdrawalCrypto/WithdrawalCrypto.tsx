import React from 'react';
import { InlineMessage, WalletText, WalletTextField } from '../../../../components';
import './WithdrawalCrypto.scss';
import { WithdrawalCryptoPercentageSelector } from './components';

const WithdrawalCrypto = () => {
    return (
        <div className='wallets-withdrawal-crypto'>
            <WalletText weight='bold'>Withdraw Bitcoin (BTC) to your wallet</WalletText>
            <div className='wallets-withdrawal-crypto-disclaimer'>
                <InlineMessage>
                    <li>
                        Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If you
                        do, the initial coin offering (ICO) tokens will not be credited into your account.
                    </li>
                    <li>
                        Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to the
                        high volatility of cryptocurrency.
                    </li>
                </InlineMessage>
            </div>
            <div className='wallets-withdrawal-crypto-address'>
                <WalletTextField label='Your Bitcoin cryptocurrency wallet address' maxLength={588} />
            </div>
            <WithdrawalCryptoPercentageSelector />
        </div>
    );
};

export default WithdrawalCrypto;
