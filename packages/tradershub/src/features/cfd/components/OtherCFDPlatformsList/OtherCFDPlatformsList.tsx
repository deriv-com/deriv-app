import React from 'react';
import { TradingAppCardLoader } from '@/components';
import { useUIContext } from '@/providers';
import { THooks } from '@/types';
import { CFDPlatformLayout } from '@cfd/components';
import { AddedDxtradeAccountsList, AvailableDxtradeAccountsList } from '@cfd/flows';
import { useActiveTradingAccount, useDxtradeAccountsList } from '@deriv/api-v2';

const OtherCFDPlatformsList = () => {
    const { uiState } = useUIContext();
    const { accountType } = uiState;
    const { data: dxTradeAccounts, isFetchedAfterMount } = useDxtradeAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const hasDxtradeAccount = dxTradeAccounts?.some(
        (account: THooks.DxtradeAccountsList) =>
            account.is_virtual === activeTradingAccount?.is_virtual && account.account_type === accountType
    );

    return (
        <CFDPlatformLayout title='Other CFD Platforms'>
            {!isFetchedAfterMount && <TradingAppCardLoader />}
            {isFetchedAfterMount &&
                (hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />)}
        </CFDPlatformLayout>
    );
};

export default OtherCFDPlatformsList;
