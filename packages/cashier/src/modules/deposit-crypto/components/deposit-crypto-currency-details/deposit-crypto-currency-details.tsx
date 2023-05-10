import React from 'react';
import { Icon, Text } from '@deriv/components';
import { CryptoConfig, getCurrencyName } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

const DepositCryptoCurrencyDetails: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { currency } = client;
    const { is_mobile } = ui;
    const currency_icon = `IcCurrency-${currency.toLowerCase()}`;
    const currency_name = getCurrencyName(currency);
    const currency_display_code = CryptoConfig.get()[currency].display_code;

    return (
        <>
            <Icon icon={currency_icon} size={64} />
            <Text align='center' size={is_mobile ? 'xs' : 's'} weight='bold'>
                {localize('Send only {{currency_name}} ({{currency_display_code}}) to this address.', {
                    currency_name,
                    currency_display_code,
                })}
            </Text>
        </>
    );
});

export default DepositCryptoCurrencyDetails;
