import React from 'react';
import { SideNote } from '@deriv/components';
import { Localize } from '@deriv/translations';

const DepositCryptoSideNoteTryFiatOnRamp: React.FC = () => (
    <SideNote
        description={
            <Localize
                i18n_default_text='Looking for a way to buy cryptocurrencies? <0>Try Fiat onramp</0>.'
                components={[<a key={0} className='link link--orange' href={'/cashier/on-ramp'} />]}
            />
        }
    />
);

export default DepositCryptoSideNoteTryFiatOnRamp;
