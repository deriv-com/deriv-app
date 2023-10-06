import { useMemo } from 'react';
import useAccountsList from './useAccountsList';

const useFiatAccountList = () => {
    const { data } = useAccountsList();

    const fiat_account_list = useMemo(
        () => data?.filter(account => !account.is_virtual && !account.currency_config?.is_crypto),
        [data]
    );

    return fiat_account_list;
};

export default useFiatAccountList;
