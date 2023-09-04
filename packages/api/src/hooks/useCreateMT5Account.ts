import { useEffect, useMemo } from 'react';
import { getActiveAuthTokenIDFromLocalStorage } from '@deriv/utils';
import { CFD_PLATFORMS } from '@deriv/shared';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

// Sample Request
// {
//     "mt5_new_account": 1,
//     "mainPassword": "Qwerty123",
//     "email": "hamza.muhammad+za11@deriv.com",
//     "leverage": 500,
//     "name": "Johnny Derived",
//     "address": "Qwerty",
//     "city": "Qwerty",
//     "country": "za",
//     "phone": "+271322312312",
//     "state": "",
//     "zipCode": "",
//     "company": "svg",
//     "account_type": "gaming",
//     "req_id": 36
// }

// Sample Response
// {
//     "account_type": "gaming",
//     "agent": null,
//     "balance": 0,
//     "currency": "USD",
//     "display_balance": "0.00",
//     "login": "MTR101045135",
//     "mt5_account_category": "conventional"
// }

/** A custom hook that creates the MT5 account given account_type, platform. */
const useCreateMT5Account = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useRequest('mt5_new_account', {
        onSuccess: () => {
            invalidate('mt5_login_list');
        },
    });

    // Add additional information to the create MT5 account response.
    const modified_data = useMemo(() => {
        if (!data?.mt5_new_account) return undefined;

        return { ...data?.mt5_new_account };
    }, [data]);

    return { data: modified_data, ...rest };
};

export default useCreateMT5Account;
