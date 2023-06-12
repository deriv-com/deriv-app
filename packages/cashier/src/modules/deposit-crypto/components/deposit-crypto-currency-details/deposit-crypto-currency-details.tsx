import React from 'react';
import { Icon, Text } from '@deriv/components';
import { useCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import './deposit-crypto-currency-details.scss';

const DepositCryptoCurrencyDetails: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { currency } = client;
    const { is_mobile } = ui;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);

    if (!currency_config) return null;

    return (
        <>
            <div className={'deposit-crypto-currency-details__icon-container'}>
                <Icon icon={currency_config.icon} size={64} />
            </div>
            <Text align='center' size={is_mobile ? 'xs' : 's'} weight='bold'>
                {localize('Send only {{currency_name}} ({{currency_code}}) to this address.', {
                    currency_name: currency_config.name,
                    currency_code: currency_config.code,
                })}
            </Text>
        </>
    );
});

export default DepositCryptoCurrencyDetails;
