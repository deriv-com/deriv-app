import React, { useEffect } from 'react';
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

type TProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const CFDPlatformsListAccounts: React.FC<TProps> = ({ onMT5PlatformListLoaded }) => {
    const { data: mt5AccountsList, isFetchedAfterMount: isMT5FetchedAfterMount } = useSortedMT5Accounts();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();

    const hasCTraderAccount = !!ctraderAccountsList?.length;
    const hasDxtradeAccount = !!dxtradeAccountsList?.length;

    useEffect(() => {
        onMT5PlatformListLoaded?.(isMT5FetchedAfterMount);
        return () => onMT5PlatformListLoaded?.(false);
    }, [isMT5FetchedAfterMount, onMT5PlatformListLoaded]);

    return (
        <div className='wallets-cfd-list-accounts__content'>
            {/* TODO: Update loader with updated skeleton loader design */}
            {!isMT5FetchedAfterMount && <TradingAppCardLoader />}
            {isMT5FetchedAfterMount &&
                mt5AccountsList?.map((account, index) => {
                    if (account.is_added)
                        return (
                            <AddedMT5AccountsList account={account} key={`added-mt5-list${account.loginid}-${index}`} />
                        );

                    return (
                        <AvailableMT5AccountsList
                            account={account}
                            key={`available-mt5-list${account.name}-${index}`}
                        />
                    );
                })}
            {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            {hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />}
        </div>
    );
};

export default CFDPlatformsListAccounts;
