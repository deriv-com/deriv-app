import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

const DepositCryptoCurrencyDetails = () => {
    const { data } = useActiveWalletAccount();

    return (
        <Text align='center' size='md' weight='bold'>
            <Localize
                i18n_default_text='Send only {{currencyConfigName}} ({{currencyConfigCode}}) to this address'
                values={{
                    currencyConfigCode: data?.currency_config?.display_code,
                    currencyConfigName: data?.currency_config?.name,
                }}
            />
        </Text>
    );
};

export default DepositCryptoCurrencyDetails;
