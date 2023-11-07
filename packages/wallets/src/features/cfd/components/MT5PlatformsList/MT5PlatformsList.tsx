import React, { useEffect, useMemo } from 'react';
import { useActiveWalletAccount, useAuthorize, useInvalidateQuery, useSortedMT5Accounts } from '@deriv/api';
import { TradingAppCardLoader } from '../../../../components/SkeletonLoader';
import { AddedMT5AccountsList, AvailableMT5AccountsList } from '../../flows/MT5';
import { GetMoreMT5Accounts } from '../../screens';
import './MT5PlatformsList.scss';

const MT5PlatformsList: React.FC = () => {
    const { isFetching } = useAuthorize();
    const { data, isFetchedAfterMount } = useSortedMT5Accounts();
    const { data: activeWallet } = useActiveWalletAccount();
    const invalidate = useInvalidateQuery();

    const hasMT5Account = useMemo(() => {
        return data?.some(account => account.is_added);
    }, [data]);

    useEffect(() => {
        if (!isFetching) {
            invalidate('mt5_login_list');
        }
    }, [invalidate, isFetching]);

    return (
        <React.Fragment>
            <section className='wallets-mt5-list'>
                <div className='wallets-mt5-list__title'>
                    <h1>Deriv MT5</h1>
                </div>
            </section>
            {!isFetchedAfterMount && <TradingAppCardLoader />}
            <div className='wallets-mt5-list__content'>
                {isFetchedAfterMount &&
                    data?.map((account, index) => {
                        if (account.is_added)
                            return (
                                <AddedMT5AccountsList
                                    account={account}
                                    key={`added-mt5-list${account.loginid}-${index}`}
                                />
                            );

                        return (
                            <AvailableMT5AccountsList
                                account={account}
                                key={`available-mt5-list${account.name}-${index}`}
                            />
                        );
                    })}
                {hasMT5Account && !activeWallet?.is_virtual && <GetMoreMT5Accounts />}
            </div>
        </React.Fragment>
    );
};

export default MT5PlatformsList;
