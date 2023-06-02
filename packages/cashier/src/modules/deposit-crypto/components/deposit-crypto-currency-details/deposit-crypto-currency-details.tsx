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
    const currency_config = useCurrencyConfig(currency);

    if (!currency_config.data) return null;

    return (
        <>
            <Icon icon={currency_config.data.icon} size={64} className={'deposit-crypto-currency-details__icon'} />
            <Text align='center' size={is_mobile ? 'xs' : 's'} weight='bold'>
                {localize('Send only {{currency_name}} ({{currency_code}}) to this address.', {
                    currency_name: currency_config.data.name,
                    currency_code: currency_config.data.code,
                })}
            </Text>
        </>
    );
});

export default DepositCryptoCurrencyDetails;
