import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import './DepositCryptoTryFiatOnRamp.scss';

const DepositCryptoTryFiatOnRamp = () => {
    const history = useHistory();

    return (
        <div className='wallets-deposit-crypto-try-fiat-onramp__container'>
            <Text align='center' className='wallets-deposit-crypto-try-fiat-onramp__content' size='xs'>
                <Localize
                    components={[
                        <a
                            className='link wallets-deposit-crypto-try-fiat-onramp__link'
                            key={0}
                            onClick={() => history.push('/wallet/on-ramp')}
                        />,
                    ]}
                    i18n_default_text='Looking for a way to buy cryptocurrencies? <0>Try Fiat onramp</0>.'
                />
            </Text>
        </div>
    );
};

export default DepositCryptoTryFiatOnRamp;
