import useCFDAllAccounts from './useCFDAllAccounts';
import useCFDDemoAccounts from './useCFDDemoAccounts';
import useCFDRealAccounts from './useCFDRealAccounts';

/**
 * this is a wrapper hook for useCFDDemoAccounts and useCFDRealAccounts
 * and it returns different cfd account types which are demo, real, and all
 */

const useCFDAccounts = () => {
    const all_cfd_accounts = useCFDAllAccounts();
    const cfd_demo_accounts = useCFDDemoAccounts();
    const cfd_real_accounts = useCFDRealAccounts();

    return {
        all: all_cfd_accounts,
        demo: cfd_demo_accounts,
        real: cfd_real_accounts,
    };
};

export default useCFDAccounts;
