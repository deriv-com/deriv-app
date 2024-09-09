import React from 'react';
import { Localize } from '@deriv-com/translations';
import { InlineMessage } from '../../../../../../components';
import './WithdrawalCryptoDisclaimer.scss';

const WithdrawalCryptoDisclaimer = () => (
    <div className='wallets-withdrawal-crypto-disclaimer'>
        <InlineMessage>
            <ul className='wallets-withdrawal-crypto-disclaimer__items'>
                <li>
                    <Localize i18n_default_text='Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If you do, the initial coin offering (ICO) tokens will not be credited into your account.' />
                </li>
                <li>
                    <Localize i18n_default_text="Please note that your maximum and minimum withdrawal limits aren't fixed. They change due to the high volatility of cryptocurrency." />
                </li>
            </ul>
        </InlineMessage>
    </div>
);

export default WithdrawalCryptoDisclaimer;
