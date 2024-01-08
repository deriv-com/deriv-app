import React, { useEffect, useMemo } from 'react';
import { useAuthorize, useInvalidateQuery, useSortedMT5Accounts } from '@deriv/api';
import TradingAppCardLoader from './TradingAppCardLoader';
import { Heading } from '@deriv/quill-design';
import { AddedMT5AccountsList, AvailableMT5AccountsList } from '../../flows/MT5';
import { GetMoreMT5Accounts } from '../../screens';
import './MT5PlatformsList.scss';

type TMT5PlatformsList = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const MT5PlatformsList = ({ onMT5PlatformListLoaded }: TMT5PlatformsList) => {
    const { isFetching } = useAuthorize();
    const { areAllAccountsCreated, data, isFetchedAfterMount } = useSortedMT5Accounts();
    const invalidate = useInvalidateQuery();

    const hasMT5Account = useMemo(() => {
        return data?.some(account => account.is_added);
    }, [data]);

    useEffect(() => {
        if (!isFetching) {
            invalidate('mt5_login_list');
        }
    }, [invalidate, isFetching]);

    useEffect(() => {
        onMT5PlatformListLoaded?.(isFetchedAfterMount);
        return () => onMT5PlatformListLoaded?.(false);
    }, [isFetchedAfterMount, onMT5PlatformListLoaded]);

    return (
        <React.Fragment>
            <section>
                <div className='pb-1200'>
                    <Heading.H1>Deriv MT5</Heading.H1>
                </div>
            </section>
            {!isFetchedAfterMount && <TradingAppCardLoader />}
            <div className='grid grid-cols-3 gap-x-800 gap-y-2400 lg:grid-cols-1 lg:grid-rows-1'>
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
                {hasMT5Account && !areAllAccountsCreated && <GetMoreMT5Accounts />}
            </div>
        </React.Fragment>
    );
};

export default MT5PlatformsList;
