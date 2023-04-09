import useCFDAccounts from './useCFDAccounts';

const useCFDDemoAccounts = () => {
    const cfd_accounts = useCFDAccounts();

    return cfd_accounts.filter(account => account.account_type === 'demo');
};

export default useCFDDemoAccounts;
