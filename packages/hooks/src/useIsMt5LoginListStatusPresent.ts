import React from 'react';
import { useMT5AccountsList } from '@deriv/api';

// TODO: Remove this todo once 'open_order_position_status' flag is available in the BE response and in type TSocketResponseData<"mt5_login_list">
const TMT5LoginAccountList = [
    'account_type',
    'balance',
    'currency',
    'display_balance',
    'login',
    'open_order_position_status',
] as const;
type TStatus = typeof TMT5LoginAccountList[number];

/**
 * A custom hook to check if the given status flag is present in the mt5_login_list of given account login id
 */
const useIsMt5LoginListStatusPresent = (status: TStatus, account_login_id: string): boolean => {
    const { data: mt5_login_list } = useMT5AccountsList();

    return React.useMemo(
        () => !!mt5_login_list?.find(account => account?.login === account_login_id)?.[status],
        [account_login_id, mt5_login_list, status]
    );
};

export default useIsMt5LoginListStatusPresent;
