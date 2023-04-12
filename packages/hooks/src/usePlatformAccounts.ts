import usePlatformDemoAccount from './usePlatformDemoAccount';
import usePlatformRealAccounts from './usePlatformRealAccounts';

type TPlatformAccountType = 'real' | 'demo';

/**
 * this is a wrapper hook for usePlatformDemoAccount and usePlatformRealAccounts
 * and it returns the accounts list based on the given account_type
 */
const usePlatformAccounts = (account_type: TPlatformAccountType) => {
    const platform_demo_accounts = usePlatformDemoAccount();
    const platform_real_accounts = usePlatformRealAccounts();

    if (account_type === 'demo') return platform_demo_accounts;

    return platform_real_accounts;
};

export default usePlatformAccounts;
