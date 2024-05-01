import { useMemo } from 'react';
import { useAccountLimits, useAccountStatus, useActiveAccount } from '@deriv/api-v2';
import { TCurrency } from '../types';
import { getAccountLimitValues } from '../utils/accountLimitsUtils';

export const useAccountLimitsData = () => {
    const { data: accountLimits, isLoading: isAccountLimitsLoading } = useAccountLimits();
    const { data: accountStatus, isLoading: isAccountStatusLoading } = useAccountStatus();
    const { data: activeAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { is_authenticated: isAuthenticated } = accountStatus || {};

    const currency = (activeAccount?.currency as TCurrency) ?? 'USD';
    const isVirtual = activeAccount?.is_virtual;

    const isDataLoading = isAccountLimitsLoading || isActiveAccountLoading || isAccountStatusLoading;

    const formattedAccountLimits = useMemo(() => {
        if (!accountLimits || isDataLoading) return [];
        return getAccountLimitValues(accountLimits, currency, isAuthenticated);
    }, [accountLimits, currency, isAuthenticated, isDataLoading]);

    return {
        accountLimits: formattedAccountLimits,
        isLoading: isDataLoading,
        isVirtual,
    };
};
