import { useStore } from '@deriv/stores';

/**
 * This hook is used to check if the client has a Swap-Free account.
 * It checks for availability of market_type 'all' in trading_platform_available_accounts API response
 */
const useHasSwapFreeAccount = () => {
    const { client } = useStore();
    const { trading_platform_available_accounts } = client;
    const has_swap_free_account = trading_platform_available_accounts.some(
        available_account => available_account.market_type === 'all'
    );

    return has_swap_free_account;
};

export default useHasSwapFreeAccount;
