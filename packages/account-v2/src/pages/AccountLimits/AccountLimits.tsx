import React from 'react';
import { useAccountLimits, useAccountStatus, useActiveAccount } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { AccountLimitsSideNote } from 'src/containers';
import { AccountLimitsTable } from 'src/containers/AccountLimitsContainer/AccountLimitsTable';
import { DemoMessage } from '../../components/DemoMessage';
import { TCurrency } from '../../types';
import { getAccountLimitValues } from '../../utils/accountLimitsUtils';

export const AccountLimits = () => {
    const { data: accountLimits, isLoading } = useAccountLimits();
    const { data: activeAccount } = useActiveAccount();
    const { data: accountStatus } = useAccountStatus();
    const currency = (activeAccount?.currency as TCurrency) ?? 'USD';
    const isVirtual = activeAccount?.is_virtual;
    const { is_authenticated: isAuthenticated } = accountStatus || {};

    if (isLoading) return <Loader isFullScreen={false} />;

    if (isVirtual) {
        return <DemoMessage className='items-center' />;
    }

    if (accountLimits) {
        const tableData = getAccountLimitValues(accountLimits, currency, isAuthenticated);

        return (
            <div className='sm:flex sm:flex-col-reverse md:grid md:grid-cols-[auto,256px] gap-16'>
                <AccountLimitsTable accountLimitValues={tableData} />
                <AccountLimitsSideNote />
            </div>
        );
    }
    return null;
};
