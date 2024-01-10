import React, { useEffect } from 'react';
import { useActiveTradingAccount, useAuthorize, useDxtradeAccountsList, useInvalidateQuery } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { THooks } from '../../../../types';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';
import { TradingAppCardLoader } from '../../../../components/Loaders/TradingAppCardLoader';

const OtherCFDPlatformsList = () => {
    const { isFetching } = useAuthorize();
    const { data: dxTradeAccounts, isFetchedAfterMount } = useDxtradeAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const invalidate = useInvalidateQuery();

    const hasDxtradeAccount = dxTradeAccounts?.some(
        (account: THooks.DxtradeAccountsList) => account.is_virtual === activeTradingAccount?.is_virtual
    );

    useEffect(() => {
        if (!isFetching) {
            invalidate('trading_platform_accounts');
        }
    }, [invalidate, isFetching]);

    return (
        <div className='pb-1200'>
            <Text bold>Other CFD Platforms</Text>
            <div className='grid grid-cols-3 gap-x-800 gap-y-2400 lg:grid-cols-1 lg:grid-rows-1'>
                {!isFetchedAfterMount && <TradingAppCardLoader />}
                {isFetchedAfterMount &&
                    (hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />)}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
