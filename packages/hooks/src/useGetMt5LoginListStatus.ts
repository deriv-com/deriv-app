import React from 'react';
import { useMT5AccountsList } from '@deriv/api';

/**
 * A custom hook to return the status field of mt5_login_list of given account login id.
 * If the status is present, then it will return the value of the status flag else undefined.
 */

const useGetMt5LoginListStatus = (account_login_id: string) => {
    const { data: mt5_login_list } = useMT5AccountsList();

    return React.useMemo(() => {
        const account = mt5_login_list.find(account => account?.login === account_login_id);
        return { status: account?.status };
    }, [account_login_id, mt5_login_list]);
};

export default useGetMt5LoginListStatus;
