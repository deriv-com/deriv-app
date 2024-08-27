import React from 'react';
import { Text } from '@deriv/components';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

const DepositCryptoCurrencyDetails: React.FC = observer(() => {
    const { isMobile } = useDevice();
    const currency_config = useCurrentCurrencyConfig();

    return (
        <Text align='center' size={isMobile ? 'xs' : 's'} weight='bold'>
            {localize('Send only {{currency_name}} ({{currency_code}}) to this address.', {
                currency_name: currency_config?.name || '',
                currency_code: currency_config?.display_code || '',
            })}
        </Text>
    );
});

export default DepositCryptoCurrencyDetails;
