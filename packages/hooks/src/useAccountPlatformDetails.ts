import { useStore } from '@deriv/stores';

const useAccountPlatformDetails = () => {
    const { client } = useStore();
    const { account_list, loginid } = client;

    return account_list.find(acc => loginid === acc.loginid);
};

export default useAccountPlatformDetails;
