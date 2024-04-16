import React, { useEffect, useMemo } from 'react';
import { TradingAppCardLoader } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { useUIContext } from '@/providers';
import { THooks } from '@/types';
import { CFDPlatformLayout } from '@cfd/components';
import { PlatformDetails } from '@cfd/constants';
import { AddedMT5AccountsList, AvailableMT5AccountsList } from '@cfd/flows';
import { GetMoreMT5Accounts } from '@cfd/screens';
import { useActiveTradingAccount, useSortedMT5Accounts } from '@deriv/api-v2';

type TMT5PlatformsListProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const MT5PlatformsList = ({ onMT5PlatformListLoaded }: TMT5PlatformsListProps) => {
    const { uiState } = useUIContext();
    const { accountType, regulation: activeRegulation } = uiState;
    const {
        areAllAccountsCreated,
        data: sortedMt5Accounts,
        isFetchedAfterMount,
    } = useSortedMT5Accounts(activeRegulation ?? '');
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { isEU } = useRegulationFlags();

    const hasMT5Account = useMemo(() => {
        return sortedMt5Accounts?.some(MT5Account => MT5Account.is_added);
    }, [sortedMt5Accounts]);

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
                sortedMt5Accounts?.map(MT5Account => {
                    if (
                        MT5Account.is_added &&
                        MT5Account.is_virtual === activeTradingAccount?.is_virtual &&
                        MT5Account.account_type === accountType
                    )
                        return (
                            <AddedMT5AccountsList account={MT5Account} key={`added-mt5-list-${MT5Account.loginid}`} />
                        );

                    return (
                        <AvailableMT5AccountsList
                            account={MT5Account as unknown as THooks.MT5AccountsList}
                            key={`available-mt5-list-${MT5Account.market_type}-${MT5Account.leverage}`}
                        />
                    );
                })}
            {shouldShowGetMoreMT5Accounts && <GetMoreMT5Accounts />}
        </CFDPlatformLayout>
    );
};

export default MT5PlatformsList;
