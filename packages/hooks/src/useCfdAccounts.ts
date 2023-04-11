import useCFDAccounts from './useCFDAllAccounts';
import useCFDDemoAccounts from './useCFDDemoAccounts';
import useCFDRealAccounts from './useCFDRealAccounts';

type TCfdAccountType = 'all' | 'real' | 'demo';

/**
 * this is a wrapper hook for useCFDDemoAccounts and useCFDRealAccounts
 * and it returns the accounts list based on the given account_type
 * you don't need to pass any argument if you need to get all CFD accounts
 */

const useGetCfdAccounts = (account_type: TCfdAccountType = 'all') => {
    const all_cfd_accounts = useCFDAccounts();
    const cfd_demo_accounts = useCFDDemoAccounts();
    const cfd_real_accounts = useCFDRealAccounts();

    if (account_type === 'demo') return cfd_demo_accounts;
    else if (account_type === 'real') return cfd_real_accounts;

    return all_cfd_accounts;
};

export default useGetCfdAccounts;
