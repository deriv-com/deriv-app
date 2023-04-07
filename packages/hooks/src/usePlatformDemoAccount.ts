import { useStore } from '@deriv/stores';

const usePlatformDemoAccount = () => {
    const { client } = useStore();
    const { accounts } = client;
    const account_list = Object.keys(accounts).map(loginid => accounts[loginid]);

    const platform_demo_account = account_list.find(account => account.is_virtual);

    return platform_demo_account;
};

export default usePlatformDemoAccount;
