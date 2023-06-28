import React from 'react';
import { Text } from '@deriv/components';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import './deposit-crypto-currency-details.scss';

const DepositCryptoCurrencyDetails: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const currency_config = useCurrentCurrencyConfig();

    return (
        <div className='deposit-crypto-currency-details'>
            <Text align='center' size={is_mobile ? 'xs' : 's'} weight='bold'>
                {localize('Send only {{currency_name}} ({{currency_code}}) to this address.', {
                    currency_name: currency_config.name,
                    currency_code: currency_config.display_code,
                })}
            </Text>
            <Text align='center' size={is_mobile ? 'xxxs' : 'xxs'} color='less-prominent'>
                {localize('This address can only be used once to make a deposit.')}
            </Text>
        </div>
    );
});

export default DepositCryptoCurrencyDetails;
