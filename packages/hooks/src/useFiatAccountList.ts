import { useStore } from '@deriv/stores';

const useFiatAccountList = () => {
    const { client } = useStore();
    const { account_list, is_crypto } = client;

    const fiat_account_list = account_list.filter(
        account => !account.is_virtual && !is_crypto(account.title || '') && account.loginid?.startsWith('CR')
    );

    return fiat_account_list;
};

export default useFiatAccountList;
