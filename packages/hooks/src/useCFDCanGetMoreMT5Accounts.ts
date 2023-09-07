import { useStore } from '@deriv/stores';
import { CFD_PLATFORMS } from '@deriv/shared';
import useIsClientHighRiskForMT5 from './useIsClientHighRiskForMT5';

const ACCOUNT_TYPES = ['synthetic', 'financial', 'all'] as const;

/**
 * Custom hook to determine whether a client is eligible to get more MT5 CFD accounts.
 * @returns `true` if the client is eligible to get more MT5 CFD accounts, false otherwise.
 */
const useCFDCanGetMoreMT5Accounts = () => {
    const {
        client: { isEligibleForMoreRealMt5 },
        traders_hub: { is_eu_user, is_real },
        modules: { cfd },
    } = useStore();
    const is_high_risk_client_for_mt5 = useIsClientHighRiskForMT5();

    /**
     * Check if the client has a specific type of MT5 CFD account.
     */
    const hasCFDAccount = (type: typeof ACCOUNT_TYPES[number]) => {
        const current_list_keys = Object.keys(cfd.current_list);
        return current_list_keys.some(key => key.startsWith(`${CFD_PLATFORMS.MT5}.real.${type}`));
    };

    return (
        is_real &&
        !is_eu_user &&
        ACCOUNT_TYPES.some(type => hasCFDAccount(type)) &&
        ACCOUNT_TYPES.some(type => isEligibleForMoreRealMt5(type)) &&
        !is_high_risk_client_for_mt5
    );
};

export default useCFDCanGetMoreMT5Accounts;
