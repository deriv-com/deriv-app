import { useStore } from '@deriv/stores';

const usePlatformDemoAccount = () => {
    const { client } = useStore();
    const { accounts } = client;
    const account_list = Object.keys(accounts).map(loginid => accounts[loginid]);

    return account_list.find(account => account.is_virtual);
};

export default usePlatformDemoAccount;
