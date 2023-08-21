import { useStore } from '@deriv/stores';
import useCFDAccounts from './useCFDAccounts';
import usePlatformAccounts from './usePlatformAccounts';
import useTotalAccountBalance from './useTotalAccountBalance';
/**
 * we can use this hook to get the total asset of the client
 */

const useTotalAsset = () => {
    const { traders_hub, client } = useStore();
    const { selected_account_type } = traders_hub;
    const { default_currency } = client;

    const is_real = selected_account_type === 'real';
    const { real: platform_real_accounts, demo: platform_demo_account } = usePlatformAccounts();
    const { real: cfd_real_accounts, demo: cfd_demo_accounts } = useCFDAccounts();

    const platform_real_balance = useTotalAccountBalance(platform_real_accounts);
    const cfd_real_balance = useTotalAccountBalance(cfd_real_accounts);
    const cfd_demo_balance = useTotalAccountBalance(cfd_demo_accounts);

    const real_total_balance = platform_real_balance.balance + cfd_real_balance.balance;
    const demo_total_balance = (platform_demo_account?.balance || 0) + cfd_demo_balance.balance;

    const total_asset_balance = is_real ? real_total_balance : demo_total_balance;
    const total_asset_currency = is_real
        ? platform_real_balance.currency || ''
        : platform_demo_account?.currency || default_currency;

    const current_timestamp = new Date().getTime() / 1000;

    return {
        total_asset_balance,
        total_asset_currency,
        last_updated: current_timestamp,
    };
};

export default useTotalAsset;
