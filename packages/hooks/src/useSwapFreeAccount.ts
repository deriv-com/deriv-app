import { useStore } from '@deriv/stores';

const useSwapFreeAccount = () => {
    const { client } = useStore();
    const { trading_platform_available_accounts } = client;
    const has_swapfree_account = trading_platform_available_accounts.some(
        available_account => available_account.market_type === 'all'
    );

    return has_swapfree_account;
};

export default useSwapFreeAccount;
