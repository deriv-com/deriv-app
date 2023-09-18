import React from 'react';
import { useStore } from '@deriv/stores';
import { useMT5LoginList } from '@deriv/api';

type TMT5LoginAccount = ReturnType<typeof useStore>['client']['mt5_login_list'][number];
type TStatus = keyof TMT5LoginAccount;

/**
 * A custom hook to check if the given status flag is present in the mt5_login_list of given account login id
 */
const useIsMt5LoginListStatusPresent = (account_login_id: string, status: TStatus): boolean => {
    const { data: mt5_login_list } = useMT5LoginList();

    return React.useMemo(
        () => !!mt5_login_list?.find((account: TMT5LoginAccount) => account?.login === account_login_id)?.[status],
        [account_login_id, mt5_login_list, status]
    );
};

export default useIsMt5LoginListStatusPresent;
