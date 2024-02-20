import React from 'react';
import { useActiveAccount } from '@deriv/api';
import { Text } from '@deriv-com/ui';

const DepositCryptoCurrencyDetails = () => {
    const { data: activeAccount } = useActiveAccount();

    return (
        <Text align='center' size='md' weight='bold'>
            Send only {activeAccount?.currency_config?.name} ({activeAccount?.currency_config?.display_code}) to this
            address
        </Text>
    );
};

export default DepositCryptoCurrencyDetails;
