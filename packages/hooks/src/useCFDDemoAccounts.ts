import useCFDAllAccounts from './useCFDAllAccounts';

/**
 *  we can use this hook to get the CFD demo accounts.
 *  it loops through the all of user's CFD accounts, finds and returns demo accounts
 */
const useCFDDemoAccounts = () => {
    const cfd_accounts = useCFDAllAccounts();

    const cfd_demo_accounts = cfd_accounts.filter(account => account.account_type === 'demo');

    return cfd_demo_accounts;
};

export default useCFDDemoAccounts;
