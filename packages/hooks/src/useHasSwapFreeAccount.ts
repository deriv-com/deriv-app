import { useStore } from '@deriv/stores';
// This hook is used to check if the client has a Swap-Free account
// It check for availability of Swap-Free account having market_type 'all'
// in available trading platform accounts
// If it is 'all', then the client has a Swap-Free account

const useHasSwapFreeAccount = () => {
    const { client } = useStore();
    const { trading_platform_available_accounts } = client;
    const has_swapfree_account = trading_platform_available_accounts.some(
        available_account => available_account.market_type === 'all'
    );

    return has_swapfree_account;
};

export default useHasSwapFreeAccount;
