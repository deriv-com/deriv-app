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
            <Text size={is_mobile ? 'xs' : 's'} align='center'>
                {localize('Looking for a way to buy cryptocurrency?')}
            </Text>
            <Text size={is_mobile ? 'xs' : 's'} align='center'>
                {localize('Use our fiat onramp services to buy and deposit cryptocurrency into your Deriv account.')}
            </Text>
            <ButtonLink to='/cashier/on-ramp'>
                <Text weight='bold' color='colored-background' size='xs'>
                    {localize('Try our Fiat onramp')}
                </Text>
            </ButtonLink>
        </div>
    );
});

export default DepositCryptoTryFiatOnRamp;
