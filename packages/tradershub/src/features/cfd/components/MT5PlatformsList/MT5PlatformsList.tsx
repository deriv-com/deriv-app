import React, { FC, Fragment, useEffect, useMemo } from 'react';
import { useActiveTradingAccount, useAuthorize, useInvalidateQuery, useSortedMT5Accounts } from '@deriv/api';
import { THooks } from '../../../../types';
import { AddedMT5AccountsList, AvailableMT5AccountsList } from '../../flows/MT5';
import { GetMoreMT5Accounts } from '../../screens';
import { Text } from '@deriv/quill-design';

type TProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const MT5PlatformsList: FC<TProps> = ({ onMT5PlatformListLoaded }) => {
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
            <section>
                <Text bold>Deriv MT5</Text>
            </section>
            <div className='grid gap-x-2400 gap-y-800 grid-cols-3 pb-6'>
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
                                account={account as unknown as THooks.MT5AccountsList}
                                key={`available-mt5-list${account.name}-${index}`}
                            />
                        );
                    })}
                {hasMT5Account && !activeTradingAccount?.is_virtual && !areAllAccountsCreated && <GetMoreMT5Accounts />}
            </div>
        </Fragment>
    );
};

export default MT5PlatformsList;
