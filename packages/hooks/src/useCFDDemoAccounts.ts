import useCFDAccounts from './useCFDAccounts';

/**
 *  we can use this hook to get the CFD demo accounts.
 *  it loops through the all of user's CFD accounts, finds and returns demo accounts
 *  @example const cfd_demo_accounts = useCFDDemoAccounts();
 *  @returns [{ balance: 100, currency: 'USD' }, { balance: 50, currency: 'EUR' }]
 */
const useCFDDemoAccounts = () => {
    const cfd_accounts = useCFDAccounts();

    const cfd_demo_accounts = cfd_accounts.filter(account => account.account_type === 'demo');

    return cfd_demo_accounts;
};

export default useCFDDemoAccounts;
