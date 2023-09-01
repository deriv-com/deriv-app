import React from 'react';
import { SideNote } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { Link } from 'react-router-dom';

const DepositCryptoSideNoteTryFiatOnRamp: React.FC = () => (
    <SideNote
        description={
            <Localize
                i18n_default_text='Looking for a way to buy cryptocurrencies? <0>Try Fiat onramp</0>.'
                components={[<Link key={0} className='link link--orange' to={'/cashier/on-ramp'} />]}
            />
        }
    />
);

export default DepositCryptoSideNoteTryFiatOnRamp;
