import React from 'react';
import { useCtraderAccountsList, useDxtradeAccountsList, useSortedMT5Accounts } from '@deriv/api-v2';
import { TradingAppCardLoader } from '../../../../components/SkeletonLoader';
import {
    AddedCTraderAccountsList,
    AddedDxtradeAccountsList,
    AddedMT5AccountsList,
    AvailableCTraderAccountsList,
    AvailableDxtradeAccountsList,
    AvailableMT5AccountsList,
} from '../../flows';
import './CFDPlatformsListAccounts.scss';

const CFDPlatformsListAccounts: React.FC = () => {
    const {
        data: mt5AccountsList,
        isFetchedAfterMount: isMT5FetchedAfterMount,
        isLoading: isMT5Loading,
    } = useSortedMT5Accounts();
    const {
        data: ctraderAccountsList,
        isFetchedAfterMount: isCtraderFetchedAfterMount,
        isLoading: isCTraderLoading,
    } = useCtraderAccountsList();
    const {
        data: dxtradeAccountsList,
        isFetchedAfterMount: isDxtradeFetchedAfterMount,
        isLoading: isDxtradeLoading,
    } = useDxtradeAccountsList();

    const isLoading = isMT5Loading || isCTraderLoading || isDxtradeLoading;
    const isFetchedAfterMount = isMT5FetchedAfterMount || isCtraderFetchedAfterMount || isDxtradeFetchedAfterMount;

    const hasCTraderAccount = !!ctraderAccountsList?.length;
    const hasDxtradeAccount = !!dxtradeAccountsList?.length;

    if (isLoading || !isFetchedAfterMount) {
        return (
            <div className='wallets-cfd-list-accounts__content'>
                {Array.from({ length: 3 }).map((_, idx) => (
                    <TradingAppCardLoader key={`wallets-carousel-loader-action-${idx}`} />
                ))}
            </div>
        );
    }

    return (
        <div className='wallets-cfd-list-accounts__content'>
            {mt5AccountsList?.map((account, index) => {
                if (account.is_added)
                    return <AddedMT5AccountsList account={account} key={`added-mt5-list${account.loginid}-${index}`} />;

                return (
                    <AvailableMT5AccountsList account={account} key={`available-mt5-list${account.name}-${index}`} />
                );
            })}
            {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            {hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />}
        </div>
    );
};

export default CFDPlatformsListAccounts;
