import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletText } from '../../../../../../components';

const DepositCryptoCurrencyDetails = () => {
    const { data } = useActiveWalletAccount();

    return (
        <WalletText align='center' size='md' weight='bold'>
            Send only {data?.currency_config?.name} ({data?.currency_config?.display_code}) to this address
        </WalletText>
    );
};

export default DepositCryptoCurrencyDetails;
