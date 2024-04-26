import { useMemo } from 'react';
import { useAccountLimits, useAccountStatus, useActiveAccount } from '@deriv/api-v2';
import { TCurrency } from '../types';
import { getAccountLimitValues } from '../utils/accountLimitsUtils';

export const useAccountLimitsData = () => {
    const { data: accountLimits, isLoading: isAccountLimitsLoading } = useAccountLimits();
    const { data: activeAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { data: accountStatus, isLoading: isAccountStatusLoading } = useAccountStatus();

    const currency = (activeAccount?.currency as TCurrency) ?? 'USD';
    const isVirtual = activeAccount?.is_virtual;
    const { is_authenticated: isAuthenticated } = accountStatus || {};

    const isDataLoading = isAccountLimitsLoading || isActiveAccountLoading || isAccountStatusLoading;

    const formattedAccountLimits = useMemo(() => {
        if (!accountLimits) return [];
        return getAccountLimitValues(accountLimits, currency, isAuthenticated);
    }, [accountLimits, currency, isAuthenticated]);

    return {
        accountLimits: formattedAccountLimits,
        isLoading: isDataLoading,
        isVirtual,
    };
};
