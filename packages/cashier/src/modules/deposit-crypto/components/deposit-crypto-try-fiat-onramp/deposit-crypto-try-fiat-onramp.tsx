import React from 'react';
import { ButtonLink, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import './deposit-crypto-try-fiat-onramp.scss';

const DepositCryptoTryFiatOnRamp: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='deposit-crypto-try-fiat-onramp'>
            <div className='deposit-crypto-try-fiat-onramp__description'>
                <Text as='p' size={is_mobile ? 'xs' : 's'} align='center'>
                    {localize('Looking for a way to buy cryptocurrency?')}
                </Text>
                {is_mobile ? null : <br />}
                <Text as='p' size={is_mobile ? 'xs' : 's'} align='center'>
                    {localize(
                        'Use our fiat onramp services to buy and deposit cryptocurrency into your Deriv account.'
                    )}
                </Text>
            </div>
            <ButtonLink to='/cashier/on-ramp'>
                <Text as='p' weight='bold' color='colored-background' size='xs'>
                    {localize('Try our Fiat onramp')}
                </Text>
            </ButtonLink>
        </div>
    );
});

export default DepositCryptoTryFiatOnRamp;
