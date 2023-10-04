import React from 'react';
import { useMT5AccountsList } from '@deriv/api';
import { useStore } from '@deriv/stores';

// TODO: Remove this todo once 'open_order_position_status' flag is available in BE response and in type TSocketResponseData<"mt5_login_list">
type DetailsOfEachMT5LoginId = ReturnType<typeof useStore>['client']['mt5_login_list'][number];
type TStatus = keyof DetailsOfEachMT5LoginId;

/**
 * A custom hook to check if the given status flag is present in the mt5_login_list of given account login id.
 * If the flag is present, 'is_flag_present' will be true, else false.
 * If the flag is present, 'flag_value' will contain the value, else undefined.
 */
const useIsMt5LoginListStatusPresent = (status: TStatus, account_login_id: string) => {
    const { data: mt5_login_list } = useMT5AccountsList();

    return React.useMemo(() => {
        const account = mt5_login_list?.find(account => account?.login === account_login_id);
        return { is_flag_present: Object.hasOwn(account ?? {}, status), flag_value: account?.[status] };
    }, [account_login_id, mt5_login_list, status]);
};

export default useIsMt5LoginListStatusPresent;
