import React from 'react';
import { TradingAppCardLoader } from '@/components';
import { THooks } from '@/types';
import { CFDPlatformLayout } from '@cfd/components';
import { PlatformDetails } from '@cfd/constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '@cfd/flows';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';

const CTraderList = () => {
    const { data: cTraderAccounts, isFetchedAfterMount } = useCtraderAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const hasCTraderAccount = cTraderAccounts?.some(
        (account: THooks.CtraderAccountsList) => account.is_virtual === activeTradingAccount?.is_virtual
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
