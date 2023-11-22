import { useAccountsList, useCFDAccountsList } from '@deriv/api';

const useTransferAccountDetailsByLoginId = (loginid: string) => {
    const { data: accounts } = useAccountsList();
    const { data: cfds } = useCFDAccountsList();

    return {
        account:
            accounts?.find(el => el.loginid === loginid) ||
            cfds?.ctrader_accounts?.find(el => el.login === loginid) ||
            cfds?.dxtrade_accounts?.find(el => el.login === loginid) ||
            cfds?.mt5_accounts?.find(el => el.login === loginid),
    };
};

export default useTransferAccountDetailsByLoginId;
