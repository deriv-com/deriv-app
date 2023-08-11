import useAccountsList from './useAccountsList';

const useFiatAccountList = () => {
    const { data } = useAccountsList();

    const fiat_account_list = data?.filter(account => !account.is_virtual && !account.currency_config?.is_crypto);

    return fiat_account_list;
};

export default useFiatAccountList;
