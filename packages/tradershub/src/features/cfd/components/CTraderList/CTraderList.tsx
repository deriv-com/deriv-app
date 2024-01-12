import React from 'react';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { TradingAppCardLoader } from '../../../../components/Loaders/TradingAppCardLoader';
import { THooks } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '../../flows/CTrader';
import { CFDPlatformLayout } from '../CFDPlatformLayout';

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
