import { useStore } from '@deriv/stores';

/**
 * Checks if a client is considered high risk for MT5 trading based on their available trading accounts.
 * @returns `true` if the client is high risk for MT5 trading, `false` otherwise.
 */
const useIsClientHighRiskForMT5 = () => {
    const {
        client: { trading_platform_available_accounts },
    } = useStore();
    const financial_available_accounts = trading_platform_available_accounts.filter(
        available_account => available_account.market_type === 'financial'
    );

    const synthetic_available_accounts = trading_platform_available_accounts.filter(
        available_account => available_account.market_type === 'gaming'
    );

    return (
        financial_available_accounts.length === 1 &&
        financial_available_accounts.every(acc => acc.shortcode === 'svg') &&
        synthetic_available_accounts.length === 1 &&
        synthetic_available_accounts.every(acc => acc.shortcode === 'svg')
    );
};

export default useIsClientHighRiskForMT5;
