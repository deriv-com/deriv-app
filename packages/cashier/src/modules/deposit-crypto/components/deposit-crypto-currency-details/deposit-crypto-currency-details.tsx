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
    const { data } = useCurrencyConfig(currency);

    if (!data) return null;

    return (
        <>
            <div className={'deposit-crypto-currency-details__icon-container'}>
                <Icon icon={data.icon} size={64} />
            </div>
            <Text align='center' size={is_mobile ? 'xs' : 's'} weight='bold'>
                {localize('Send only {{currency_name}} ({{currency_code}}) to this address.', {
                    currency_name: data.name,
                    currency_code: data.code,
                })}
            </Text>
        </>
    );
});

export default DepositCryptoCurrencyDetails;
