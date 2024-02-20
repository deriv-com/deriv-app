import React, { useEffect, useMemo } from 'react';
import { TradingAppCardLoader, useUIContext } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { THooks } from '@/types';
import { CFDPlatformLayout } from '@cfd/components';
import { PlatformDetails } from '@cfd/constants';
import { AddedMT5AccountsList, AvailableMT5AccountsList } from '@cfd/flows';
import { GetMoreMT5Accounts } from '@cfd/screens';
import { useActiveTradingAccount, useAuthorize, useInvalidateQuery, useSortedMT5Accounts } from '@deriv/api';

type TMT5PlatformsListProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const MT5PlatformsList = ({ onMT5PlatformListLoaded }: TMT5PlatformsListProps) => {
    const { isFetching } = useAuthorize();
    const { uiState } = useUIContext();
    const activeRegulation = uiState.regulation;
    const { areAllAccountsCreated, data, isFetchedAfterMount } = useSortedMT5Accounts(activeRegulation ?? '');
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { isEU } = useRegulationFlags();
    const invalidate = useInvalidateQuery();

    const hasMT5Account = useMemo(() => {
        return data?.some(account => account.is_added);
    }, [data]);

    // Check if we need to invalidate the query
    useEffect(() => {
        if (!isFetching) {
            invalidate('mt5_login_list');
        }
    }, [invalidate, isFetching]);

    useEffect(() => {
        onMT5PlatformListLoaded?.(isFetchedAfterMount);
        return () => onMT5PlatformListLoaded?.(false);
    }, [isFetchedAfterMount, onMT5PlatformListLoaded]);

    const shouldShowGetMoreMT5Accounts =
        hasMT5Account && !activeTradingAccount?.is_virtual && !areAllAccountsCreated && !isEU && isFetchedAfterMount;

    return (
        <CFDPlatformLayout title={PlatformDetails.mt5.title}>
            {!isFetchedAfterMount && (
                <div className='pt-8 lg:pt-18'>
                    <TradingAppCardLoader />
                </div>
            )}
            {isFetchedAfterMount &&
                data?.map(account => {
                    if (account.is_added)
                        return <AddedMT5AccountsList account={account} key={`added-mt5-list-${account.loginid}`} />;

                    return (
                        <AvailableMT5AccountsList
                            account={account as unknown as THooks.MT5AccountsList}
                            key={`available-mt5-list-${account.market_type}-${account.shortcode}`}
                        />
                    );
                })}
            {shouldShowGetMoreMT5Accounts && <GetMoreMT5Accounts />}
        </CFDPlatformLayout>
    );
};

export default MT5PlatformsList;
