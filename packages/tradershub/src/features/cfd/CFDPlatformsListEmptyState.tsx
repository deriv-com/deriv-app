import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useTradingAccountsList } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import './CFDPlatformsList.scss';

const CFDPlatformsListEmptyState = () => {
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: tradingAccountsList } = useTradingAccountsList();
    const history = useHistory();

    const fiatAccount = useMemo(
        () => tradingAccountsList?.find(account => account.account_type === 'doughflow'),
        [tradingAccountsList]
    );

    return (
        <div className='flex flex-col items-center self-stretch justify-center gap-1200 py-1200 pb-2400'>
            <Text bold className='text-center'>
                To trade CFDs, you’ll need to use your {fiatAccount?.currency} Wallet. Click Transfer to move your{' '}
                {activeTrading?.currency} to your {fiatAccount?.currency} Wallet.
            </Text>
            <Button colorStyle='black' onClick={() => history.push('/cashier/transfer')} size='lg' variant='secondary'>
                Transfer
            </Button>
        </div>
    );
};

export default CFDPlatformsListEmptyState;
