import { useStore } from '@deriv/stores';

const useCurrentAccountDetails = () => {
    const { client } = useStore();
    const { account_list, loginid } = client;

    const current_account = account_list.find(account => loginid === account.loginid);

    return current_account;
};

export default useCurrentAccountDetails;
