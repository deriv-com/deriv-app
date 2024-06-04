import React from 'react';
import { TradingAppCardLoader } from '@/components';
import { useUIContext } from '@/providers';
import { THooks } from '@/types';
import { CFDPlatformLayout } from '@cfd/components';
import { PlatformDetails } from '@cfd/constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '@cfd/flows';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api-v2';

const CTraderList = () => {
    const { uiState } = useUIContext();
    const { accountType } = uiState;
    const { data: cTraderAccounts, isFetchedAfterMount } = useCtraderAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const hasCTraderAccount = cTraderAccounts?.some(
        (account: THooks.CtraderAccountsList) =>
            account.is_virtual === activeTradingAccount?.is_virtual && account.account_type === accountType
    );

    return (
        <CFDPlatformLayout title={PlatformDetails.ctrader.title}>
            {!isFetchedAfterMount && <TradingAppCardLoader />}
            {isFetchedAfterMount &&
                (hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />)}
        </CFDPlatformLayout>
    );
};

export default CTraderList;
