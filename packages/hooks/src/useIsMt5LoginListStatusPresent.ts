import React from 'react';
import { useMT5AccountsList } from '@deriv/api';

type TMT5Accounts = ReturnType<typeof useMT5AccountsList>['data'][number];
type TStatusKey = keyof TMT5Accounts;

/**
 * A custom hook to check if the given status flag is present in the mt5_login_list of given account login id.
 * If the flag is present, 'is_flag_present' will be true, else false.
 * If the flag is present, 'flag_value' will contain the value, else undefined.
 */
const useIsMt5LoginListStatusPresent = (status: TStatusKey, account_login_id: string) => {
    const { data: mt5_login_list } = useMT5AccountsList();

    return React.useMemo(() => {
        const account = mt5_login_list.find(account => account?.login === account_login_id);
        return { is_flag_present: Object.hasOwn(account ?? {}, status), flag_value: account?.[status] };
    }, [account_login_id, mt5_login_list, status]);
};

export default useIsMt5LoginListStatusPresent;
