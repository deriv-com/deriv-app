import React, { useEffect } from 'react';
import { useActiveTradingAccount, useAuthorize, useDxtradeAccountsList, useInvalidateQuery } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';

const OtherCFDPlatformsList = () => {
    const { isFetching } = useAuthorize();
    const { data: dxTradeAccounts, isFetchedAfterMount } = useDxtradeAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const invalidate = useInvalidateQuery();

    const hasDxtradeAccount = dxTradeAccounts?.some(account => account.is_virtual === activeTradingAccount?.is_virtual);

    useEffect(() => {
        if (!isFetching) {
            invalidate('trading_platform_accounts');
        }
    }, [invalidate, isFetching]);

    return (
        <div className='pb-1200'>
            <Text bold>Other CFD Platforms</Text>
            <div>
                {isFetchedAfterMount &&
                    (hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />)}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
