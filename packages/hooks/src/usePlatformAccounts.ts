import usePlatformDemoAccount from './usePlatformDemoAccount';
import usePlatformRealAccounts from './usePlatformRealAccounts';

/**
 * this is a wrapper hook for usePlatformDemoAccount and usePlatformRealAccounts
 * and it returns different platform accounts which are demo, and real
 */
const usePlatformAccounts = () => {
    const platform_demo_account = usePlatformDemoAccount();
    const platform_real_accounts = usePlatformRealAccounts();

    return {
        demo: platform_demo_account,
        real: platform_real_accounts,
    };
};

export default usePlatformAccounts;
