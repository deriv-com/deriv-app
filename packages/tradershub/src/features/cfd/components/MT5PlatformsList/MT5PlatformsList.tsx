import React, { Fragment, useEffect, useMemo } from 'react';
import { useActiveTradingAccount, useAuthorize, useInvalidateQuery, useSortedMT5Accounts } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { THooks } from '../../../../types';
import { AddedMT5AccountsList, AvailableMT5AccountsList } from '../../flows/MT5';
import { GetMoreMT5Accounts } from '../../screens';

type TMT5PlatformsListProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const MT5PlatformsList = ({ onMT5PlatformListLoaded }: TMT5PlatformsListProps) => {
    const { isFetching } = useAuthorize();
    const { areAllAccountsCreated, data, isFetchedAfterMount } = useSortedMT5Accounts();
    const { data: activeTradingAccount } = useActiveTradingAccount();
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
        <Fragment>
            <Text bold>Deriv MT5</Text>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
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
                {hasMT5Account && !activeTradingAccount?.is_virtual && !areAllAccountsCreated && <GetMoreMT5Accounts />}
            </div>
        </Fragment>
    );
};

export default MT5PlatformsList;
