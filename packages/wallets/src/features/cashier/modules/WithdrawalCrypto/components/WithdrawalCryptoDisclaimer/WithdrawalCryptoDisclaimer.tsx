import React from 'react';
import { InlineMessage } from '../../../../../../components';
import './WithdrawalCryptoDisclaimer.scss';

const WithdrawalDisclaimer = () => (
    <div className='wallets-withdrawal-crypto-disclaimer'>
        <InlineMessage>
            <ul className='wallets-withdrawal-crypto-disclaimer__items'>
                <li>
                    Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If you do,
                    the initial coin offering (ICO) tokens will not be credited into your account.
                </li>
                <li>
                    Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to the
                    high volatility of cryptocurrency.
                </li>
            </ul>
        </InlineMessage>
    </div>
);

export default WithdrawalDisclaimer;
