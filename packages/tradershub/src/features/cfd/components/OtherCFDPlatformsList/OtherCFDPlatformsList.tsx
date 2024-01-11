import React, { useEffect } from 'react';
import { useActiveTradingAccount, useAuthorize, useDxtradeAccountsList, useInvalidateQuery } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { TradingAppCardLoader } from '../../../../components/Loaders/TradingAppCardLoader';
import { THooks } from '../../../../types';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';

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
        <div className='border-solid border-b-xs border-b-system-light-hover-background pb-400 lg:border-none'>
            <Text bold className='pb-800'>
                Other CFD Platforms
            </Text>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                {!isFetchedAfterMount && <TradingAppCardLoader />}
                {isFetchedAfterMount &&
                    (hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />)}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
