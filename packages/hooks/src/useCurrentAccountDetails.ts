import { useStore } from '@deriv/stores';

const useCurrentAccountDetails = () => {
    const { client } = useStore();
    const { account_list, loginid } = client;

    return account_list.find(account => loginid === account.loginid);
};

export default useCurrentAccountDetails;
