import useCFDAccounts from './useCFDAccounts';

const useCFDDemoAccounts = () => {
    const cfd_accounts = useCFDAccounts();

    const cfd_demo_accounts = cfd_accounts.filter(account => account.account_type === 'demo');

    return cfd_demo_accounts;
};

export default useCFDDemoAccounts;
