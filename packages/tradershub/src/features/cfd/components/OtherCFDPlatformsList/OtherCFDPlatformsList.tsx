import React, { useEffect } from 'react';
import { useActiveTradingAccount, useAuthorize, useDxtradeAccountsList, useInvalidateQuery } from '@deriv/api';
import { TradingAppCardLoader } from '../../../../components/Loaders/TradingAppCardLoader';
import { THooks } from '../../../../types';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '../../flows/OtherCFDs/Dxtrade';
import { CFDPlatformLayout } from '../CFDPlatformLayout';

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
        <CFDPlatformLayout title='Other CFD Platforms'>
            {!isFetchedAfterMount && <TradingAppCardLoader />}
            {isFetchedAfterMount &&
                (hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />)}
        </CFDPlatformLayout>
    );
};

export default OtherCFDPlatformsList;
